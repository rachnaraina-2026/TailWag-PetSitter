import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useStore, serviceById } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Calendar, Dog as DogIcon, PawPrint, Plus, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Happy Paws" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, dogs, bookings } = useStore();
  if (!user) return <Navigate to="/auth" />;

  const now = Date.now();
  const upcoming = bookings
    .filter((b) => b.status !== "Cancelled" && new Date(`${b.date}T${b.time}`).getTime() > now)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const past = bookings.filter((b) => !upcoming.includes(b));
  const favoriteWalker =
    Object.entries(
      bookings.reduce<Record<string, number>>((acc, b) => ((acc[b.walker] = (acc[b.walker] || 0) + 1), acc), {}),
    ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Not yet assigned";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {user.name} 🐾</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening with your pack.</p>
        </div>
        <Button asChild size="lg" className="rounded-full gradient-primary text-white shadow-soft">
          <Link to="/bookings/new"><Plus className="mr-1 h-4 w-4" /> Quick Book</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Stat icon={Calendar} label="Upcoming walks" value={upcoming.length} />
        <Stat icon={DogIcon} label="Dogs on profile" value={dogs.length} />
        <Stat icon={PawPrint} label="Favorite walker" value={favoriteWalker} small />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Section title="Upcoming walks" empty="No walks scheduled — book one to get started.">
          {upcoming.slice(0, 4).map((b) => {
            const svc = serviceById(b.serviceId);
            const dog = dogs.find((d) => b.dogIds.includes(d.id));
            return (
              <Link key={b.id} to="/bookings/$id" params={{ id: b.id }} className="block rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{dog?.name ?? "Your dog"} · {svc?.name}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{b.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground"><Clock className="mr-1 inline h-3.5 w-3.5" />{b.date} · {b.time} · Walker {b.walker}</p>
              </Link>
            );
          })}
        </Section>
        <Section title="Past walks" empty="No completed walks yet.">
          {past.slice(0, 4).map((b) => {
            const svc = serviceById(b.serviceId);
            return (
              <Link key={b.id} to="/bookings/$id" params={{ id: b.id }} className="block rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <p className="font-semibold">{svc?.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.date} · {b.time} · {b.status}</p>
              </Link>
            );
          })}
        </Section>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900 shadow-soft">
        <AlertCircle className="mr-2 inline h-4 w-4" />
        Cancellation policy: free cancellation up to 24 hours before your scheduled walk.
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, small }: { icon: React.ElementType; label: string; value: string | number; small?: boolean }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`truncate font-bold ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, empty }: { title: string; children: React.ReactNode; empty: string }) {
  const arr = Array.isArray(children) ? children : [children];
  const has = arr.some(Boolean) && arr.length > 0 && arr.filter((c) => c).length > 0;
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="space-y-3">{has ? children : <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{empty}</p>}</div>
    </section>
  );
}