import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Clock, PawPrint, Repeat, Sparkles } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Happy Paws Dog Walking" },
      { name: "description", content: "Explore 30-minute walks, 60-minute adventures, puppy visits, and recurring weekly plans." },
      { property: "og:title", content: "Happy Paws Services" },
      { property: "og:description", content: "Walks, puppy visits, and recurring plans tailored to your dog." },
    ],
  }),
  component: Services,
});

const icons = { "walk-30": Clock, "walk-60": PawPrint, "puppy-visit": Sparkles, weekly: Repeat } as const;

function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Services built around your dog</h1>
        <p className="mt-3 text-muted-foreground">Choose the perfect walk for your pup's energy and schedule.</p>
      </header>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = icons[s.id as keyof typeof icons] ?? Clock;
          return (
            <div key={s.id} className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">{s.name}</h2>
              <p className="mt-2 text-muted-foreground">{s.description}</p>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">${s.price}<span className="text-sm font-normal text-muted-foreground">{s.id === "weekly" ? "/week" : ""}</span></p>
                  <p className="text-xs text-muted-foreground">{s.duration} min</p>
                </div>
                <Button asChild className="rounded-full">
                  <Link to="/bookings/new">Book</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}