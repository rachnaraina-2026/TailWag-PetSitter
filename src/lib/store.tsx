import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  login: (email: string, name?: string) => void;
  logout: () => void;
  dogs: Dog[];
  addDog: (d: Omit<Dog, "id">) => Dog;
  updateDog: (id: string, d: Partial<Dog>) => void;
  removeDog: (id: string) => void;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "status" | "walker" | "createdAt">) => Booking;
  cancelBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  isSlotTaken: (date: string, time: string) => boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

function useLocal<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocal<User>("hp_user", null);
  const [dogs, setDogs] = useLocal<Dog[]>("hp_dogs", []);
  const [bookings, setBookings] = useLocal<Booking[]>("hp_bookings", []);

  const login = useCallback(
    (email: string, name?: string) => {
      setUser({
        id: crypto.randomUUID(),
        email,
        name: name || email.split("@")[0],
      });
    },
    [setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const addDog = useCallback(
    (d: Omit<Dog, "id">) => {
      const dog: Dog = { ...d, id: crypto.randomUUID() };
      setDogs((prev) => [...prev, dog]);
      return dog;
    },
    [setDogs],
  );
  const updateDog = useCallback(
    (id: string, patch: Partial<Dog>) =>
      setDogs((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
    [setDogs],
  );
  const removeDog = useCallback(
    (id: string) => setDogs((prev) => prev.filter((d) => d.id !== id)),
    [setDogs],
  );

  const isSlotTaken = useCallback(
    (date: string, time: string) =>
      bookings.some(
        (b) => b.date === date && b.time === time && b.status !== "Cancelled",
      ),
    [bookings],
  );

  const addBooking = useCallback(
    (b: Omit<Booking, "id" | "status" | "walker" | "createdAt">) => {
      const booking: Booking = {
        ...b,
        id: "HP-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        status: "Confirmed",
        walker: WALKERS[Math.floor(Math.random() * WALKERS.length)],
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [booking, ...prev]);
      return booking;
    },
    [setBookings],
  );

  const cancelBooking = useCallback(
    (id: string) =>
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
      ),
    [setBookings],
  );

  const getBooking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      user,
      login,
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
      login,
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