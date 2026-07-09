import { createFileRoute } from "@tanstack/react-router";
import walker from "@/assets/walker.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Happy Paws" },
      { name: "description", content: "Meet the people behind Happy Paws — dog lovers on a mission to give every pup a great walk." },
      { property: "og:title", content: "About Happy Paws" },
      { property: "og:description", content: "A team of insured, trained dog walkers who treat your pup like family." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">We built Happy Paws for dogs like ours.</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Happy Paws started in 2019 in a small neighborhood park. Today we're a network of vetted,
        insured walkers serving thousands of pet parents — but our mission is unchanged: give every
        dog the walk they deserve, and give every parent complete peace of mind.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <img src={walker} alt="Happy Paws walker" width={1200} height={1200} loading="lazy" className="h-full w-full rounded-3xl object-cover shadow-card" />
        <div className="space-y-6">
          {[
            { n: "12K+", l: "Pet parents" },
            { n: "500+", l: "Walkers" },
            { n: "8,400+", l: "Walks completed" },
            { n: "4.9★", l: "Average rating" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <p className="text-3xl font-bold text-primary">{s.n}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}