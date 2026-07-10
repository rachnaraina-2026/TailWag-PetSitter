import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  photo?: string;
  energy: "Low" | "Medium" | "High";
  medical?: string;
  behavior?: string;
  emergency?: string;
  vet?: string;
  feeding?: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export type BookingStatus =
  | "Scheduled"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type Booking = {
  id: string;
  dogIds: string[];
  serviceId: string;
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // HH:mm
  notes?: string;
  status: BookingStatus;
  walker: string;
  price: number;
  createdAt: string;
};

export type User = { id: string; name: string; email: string } | null;

export const SERVICES: Service[] = [
  {
    id: "walk-30",
    name: "30-Minute Walk",
    duration: 30,
    price: 22,
    description: "A brisk, energizing walk around the neighborhood.",
  },
  {
    id: "walk-60",
    name: "60-Minute Adventure",
    duration: 60,
    price: 38,
    description: "A longer outing with play and exploration.",
  },
  {
    id: "puppy-visit",
    name: "Puppy Visit",
    duration: 20,
    price: 18,
    description: "Potty break, playtime, and cuddles for young pups.",
  },
  {
    id: "weekly",
    name: "Weekly Recurring",
    duration: 30,
    price: 85,
    description: "5 walks per week — save 22%.",
  },
];

export const WALKERS = [
  "Alex Rivera",
  "Priya Shah",
  "Marcus Chen",
  "Sam O'Neil",
  "Jordan Blake",
];

export const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

type StoreCtx = {
  user: User;
  loading: boolean;
  logout: () => Promise<void>;
  dogs: Dog[];
  addDog: (d: Omit<Dog, "id">) => Promise<Dog>;
  updateDog: (id: string, d: Partial<Dog>) => Promise<void>;
  removeDog: (id: string) => Promise<void>;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "status" | "walker" | "createdAt">) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  getBooking: (id: string) => Booking | undefined;
  isSlotTaken: (date: string, time: string) => boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

type DogRow = {
  id: string; name: string; breed: string; age: number; weight: number;
  photo: string | null; energy: string; medical: string | null;
  behavior: string | null; emergency: string | null; vet: string | null; feeding: string | null;
};
type BookingRow = {
  id: string; reference: string; dog_ids: string[]; service_id: string;
  date: string; time: string; notes: string | null; status: string;
  walker: string; price: number; created_at: string;
};

function rowToDog(r: DogRow): Dog {
  return {
    id: r.id, name: r.name, breed: r.breed, age: Number(r.age), weight: Number(r.weight),
    photo: r.photo ?? undefined, energy: (r.energy as Dog["energy"]) || "Medium",
    medical: r.medical ?? "", behavior: r.behavior ?? "", emergency: r.emergency ?? "",
    vet: r.vet ?? "", feeding: r.feeding ?? "",
  };
}
function rowToBooking(r: BookingRow): Booking {
  return {
    id: r.id, dogIds: r.dog_ids ?? [], serviceId: r.service_id,
    date: r.date, time: r.time, notes: r.notes ?? "",
    status: r.status as BookingStatus, walker: r.walker,
    price: Number(r.price), createdAt: r.created_at,
  };
}

function makeReference() {
  return "HP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Auth listener + initial session
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Map session to app user + load profile name
  useEffect(() => {
    if (!session?.user) {
      setUser(null);
      setDogs([]);
      setBookings([]);
      return;
    }
    const u = session.user;
    setUser({
      id: u.id,
      email: u.email ?? "",
      name: (u.user_metadata?.name as string) || (u.email?.split("@")[0] ?? "Friend"),
    });
    // Fetch profile display name (best effort)
    supabase.from("profiles").select("name").eq("id", u.id).maybeSingle().then(({ data }) => {
      if (data?.name) setUser((prev) => (prev ? { ...prev, name: data.name } : prev));
    });
    // Load dogs + bookings
    supabase.from("dogs").select("*").order("created_at", { ascending: true }).then(({ data }) => {
      if (data) setDogs(data.map((r) => rowToDog(r as unknown as DogRow)));
    });
    supabase.from("bookings").select("*").order("date", { ascending: false }).then(({ data }) => {
      if (data) setBookings(data.map((r) => rowToBooking(r as unknown as BookingRow)));
    });
  }, [session]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const addDog = useCallback(async (d: Omit<Dog, "id">) => {
    if (!user) throw new Error("Not signed in");
    const payload = {
      user_id: user.id,
      name: d.name, breed: d.breed, age: d.age, weight: d.weight,
      photo: d.photo || null, energy: d.energy,
      medical: d.medical || null, behavior: d.behavior || null,
      emergency: d.emergency || null, vet: d.vet || null, feeding: d.feeding || null,
    };
    const { data, error } = await supabase.from("dogs").insert(payload).select("*").single();
    if (error || !data) throw error ?? new Error("Insert failed");
    const dog = rowToDog(data as unknown as DogRow);
    setDogs((prev) => [...prev, dog]);
    return dog;
  }, [user]);

  const updateDog = useCallback(async (id: string, patch: Partial<Dog>) => {
    const upd: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === "id") continue;
      upd[k] = v === "" ? null : v;
    }
    const { error } = await supabase.from("dogs").update(upd).eq("id", id);
    if (error) throw error;
    setDogs((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const removeDog = useCallback(async (id: string) => {
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (error) throw error;
    setDogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const isSlotTaken = useCallback(
    (date: string, time: string) =>
      bookings.some(
        (b) => b.date === date && b.time === time && b.status !== "Cancelled",
      ),
    [bookings],
  );

  const addBooking = useCallback(async (b: Omit<Booking, "id" | "status" | "walker" | "createdAt">) => {
    if (!user) throw new Error("Not signed in");
    const walker = WALKERS[Math.floor(Math.random() * WALKERS.length)];
    const payload = {
      user_id: user.id,
      reference: makeReference(),
      dog_ids: b.dogIds,
      service_id: b.serviceId,
      date: b.date,
      time: b.time,
      notes: b.notes || null,
      status: "Confirmed",
      walker,
      price: b.price,
    };
    const { data, error } = await supabase.from("bookings").insert(payload).select("*").single();
    if (error || !data) throw error ?? new Error("Insert failed");
    const booking = rowToBooking(data as unknown as BookingRow);
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, [user]);

  const cancelBooking = useCallback(async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "Cancelled" }).eq("id", id);
    if (error) throw error;
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    );
  }, []);

  const getBooking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      user,
      loading,
      logout,
      dogs,
      addDog,
      updateDog,
      removeDog,
      bookings,
      addBooking,
      cancelBooking,
      getBooking,
      isSlotTaken,
    }),
    [
      user,
      loading,
      logout,
      dogs,
      addDog,
      updateDog,
      removeDog,
      bookings,
      addBooking,
      cancelBooking,
      getBooking,
      isSlotTaken,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function hoursUntil(dateISO: string, time: string) {
  const target = new Date(`${dateISO}T${time}:00`);
  return (target.getTime() - Date.now()) / (1000 * 60 * 60);
}

export function canCancel(b: Booking) {
  if (b.status === "Cancelled" || b.status === "Completed") return false;
  return hoursUntil(b.date, b.time) > 24;
}

export function serviceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}