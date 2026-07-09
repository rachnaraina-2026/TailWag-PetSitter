import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Camera,
  Bell,
  Award,
  Star,
  PawPrint,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import heroDog from "@/assets/hero-dog.jpg";
import walker from "@/assets/walker.jpg";
import puppy from "@/assets/puppy.jpg";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  { icon: MapPin, title: "GPS-tracked walks", body: "Follow every step of your dog's walk in real time." },
  { icon: Award, title: "Professional walkers", body: "Trained, experienced, and dog-obsessed." },
  { icon: ShieldCheck, title: "Background checked", body: "Every walker is vetted and fully insured." },
  { icon: Calendar, title: "Flexible scheduling", body: "Book once or set up recurring weekly walks." },
  { icon: Bell, title: "Real-time updates", body: "Notifications when your walker arrives & departs." },
  { icon: Camera, title: "Photos every walk", body: "A little smile from your best friend, every time." },
];

const steps = [
  "Create your account",
  "Add your dog",
  "Book a walk",
  "Meet your walker",
  "Get updates & photos",
];

const testimonials = [
  { name: "Emma R.", quote: "Bailey comes home tired and happy. The photos make my workday." },
  { name: "David L.", quote: "Booking took 30 seconds. My walker was on time and lovely." },
  { name: "Sofia M.", quote: "Peace of mind for me, adventures for Max. Worth every penny." },
];

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute -top-10 -left-10 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-32 right-0 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-white/70 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              <PawPrint className="h-3.5 w-3.5" /> Trusted by 12,000+ pet parents
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reliable Dog Walking for{" "}
              <span className="bg-clip-text text-transparent gradient-primary">Busy Pet Parents</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Professional, insured dog walkers who treat your dog like family. Book a walk in
              minutes and get GPS tracking, photos, and updates every time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full gradient-primary text-white shadow-soft">
                <Link to="/bookings/new">
                  Book a Walk <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/services">Learn More</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-1 text-foreground">4.9/5</span>
              </div>
              <span>· 8,400+ walks completed</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-card">
              <img
                src={heroDog}
                alt="Happy golden retriever on a walk"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-card sm:-left-6">
              <img src={puppy} alt="" width={48} height={48} className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
              <div>
                <p className="text-xs text-muted-foreground">Walk in progress</p>
                <p className="text-sm font-semibold">Bailey · 1.2 mi</p>
              </div>
              <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
            <PawPrint className="absolute -top-4 right-4 h-10 w-10 rotate-12 text-primary/30 animate-float" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything your dog deserves</h2>
          <p className="mt-3 text-muted-foreground">
            Premium service, thoughtful details, and total peace of mind.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">Five simple steps from sign-up to happy tails.</p>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s} className="relative rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                <span className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-3 font-semibold">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-2 text-muted-foreground">Pay per walk or save with a weekly plan.</p>
          </div>
          <Button asChild variant="link" className="text-primary">
            <Link to="/pricing">See all plans <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.id} className="flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <p className="text-sm font-semibold text-primary">{s.name}</p>
              <p className="mt-2 text-3xl font-bold">
                ${s.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {s.id === "weekly" ? "/wk" : ""}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <Button asChild className="mt-6 rounded-full">
                <Link to="/bookings/new">Book</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by pet parents</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] gradient-primary p-10 text-white shadow-card sm:p-14">
          <PawPrint className="absolute -right-6 -top-6 h-40 w-40 rotate-12 opacity-15" />
          <PawPrint className="absolute -bottom-8 left-10 h-28 w-28 -rotate-12 opacity-15" />
          <div className="relative grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Your dog's next great walk is one tap away.</h2>
              <p className="mt-3 max-w-xl text-white/85">
                Join thousands of pet parents who trust Happy Paws for safe, joyful walks.
              </p>
              <ul className="mt-4 flex flex-wrap gap-4 text-sm">
                {["Insured walkers", "GPS tracking", "Photo reports"].map((x) => (
                  <li key={x} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                <Link to="/bookings/new">Book a Walk</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full text-white hover:bg-white/10 hover:text-white">
                <Link to="/auth">Create an account</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          <img src={walker} alt="Dog walker" width={120} height={120} className="h-28 w-28 rounded-full object-cover shadow-soft" loading="lazy" />
          <p className="max-w-xl text-center text-muted-foreground">
            Every Happy Paws walker is background checked, insured, and trained in canine first aid.
          </p>
        </div>
      </section>
    </div>
  );
}
