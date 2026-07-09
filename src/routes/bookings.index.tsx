import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, serviceById, canCancel, type Booking } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Plus } from "lucide-react";

export const Route = createFileRoute("/bookings/")({
  head: () => ({ meta: [{ title: "My Bookings — Happy Paws" }] }),
  component: BookingsList,
});

function BookingsList() {
  const { user, bookings, dogs } = useStore();
  const [filter, setFilter] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  if (!user) return <Navigate to="/auth" />;

  const now = Date.now();
  const isUpcoming = (b: Booking) => b.status !== "Cancelled" && b.status !== "Completed" && new Date(`${b.date}T${b.time}`).getTime() >= now - 3600000;
  const filtered = bookings.filter((b) =>
    filter === "upcoming" ? isUpcoming(b) :
    filter === "cancelled" ? b.status === "Cancelled" :
    b.status === "Completed" || (!isUpcoming(b) && b.status !== "Cancelled")
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">Every walk, past and present.</p>
        </div>
        <Button asChild className="rounded-full gradient-primary text-white shadow-soft">
          <Link to="/bookings/new"><Plus className="mr-1 h-4 w-4" /> New booking</Link>
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mt-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center shadow-soft">
            <CalendarDays className="mx-auto h-10 w-10 text-primary/50" />
            <p className="mt-4 text-lg font-semibold">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Book a walk to see it here.</p>
          </div>
        )}
        {filtered.map((b) => {
          const svc = serviceById(b.serviceId);
          const dog = dogs.find((d) => b.dogIds.includes(d.id));
          return (
            <div key={b.id} className="grid gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-bold">{dog?.name ?? "Dog"} · {svc?.name}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{b.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{b.date} · {b.time} · Walker {b.walker} · ${b.price}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to="/bookings/$id" params={{ id: b.id }}>View</Link>
                </Button>
                {canCancel(b) && (
                  <Button asChild size="sm" variant="ghost" className="rounded-full text-destructive hover:text-destructive">
                    <Link to="/bookings/$id" params={{ id: b.id }}>Cancel</Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="ghost" className="rounded-full">
                  <Link to="/bookings/new">Rebook</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}