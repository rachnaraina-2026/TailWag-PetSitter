import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Happy Paws" },
      { name: "description", content: "Simple, transparent pricing. Pay per walk or save with weekly plans." },
      { property: "og:title", content: "Happy Paws Pricing" },
      { property: "og:description", content: "Transparent per-walk pricing and recurring weekly plans." },
    ],
  }),
  component: Pricing,
});

const perks = ["Insured & background-checked walker", "GPS-tracked route", "Photo report", "Real-time updates", "Free cancellation 24h+"];

function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Pricing that makes tails wag</h1>
        <p className="mt-3 text-muted-foreground">No surprise fees. Cancel free up to 24h before your walk.</p>
      </header>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => {
          const featured = i === 1;
          return (
            <div
              key={s.id}
              className={`relative flex flex-col rounded-3xl border p-6 shadow-soft ${featured ? "border-primary bg-card shadow-card" : "border-border/60 bg-card"}`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-soft">
                  Most Popular
                </span>
              )}
              <p className="text-sm font-semibold text-primary">{s.name}</p>
              <p className="mt-3 text-4xl font-bold">
                ${s.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {s.id === "weekly" ? "/week" : "/walk"}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-8 rounded-full ${featured ? "gradient-primary text-white" : ""}`} variant={featured ? "default" : "outline"}>
                <Link to="/bookings/new">Book {s.name}</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}