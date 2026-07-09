import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Happy Paws" },
      { name: "description", content: "Answers about booking, cancellations, walker screening, weather, and more." },
      { property: "og:title", content: "Happy Paws FAQ" },
      { property: "og:description", content: "Everything you need to know about Happy Paws dog walking." },
    ],
  }),
  component: Faq,
});

const items = [
  { q: "How do I cancel a booking?", a: "You can cancel free of charge up to 24 hours before your scheduled walk from the My Bookings page. Within 24 hours, please contact support." },
  { q: "Can I book recurring walks?", a: "Yes — choose the Weekly Recurring plan or repeat any booking from your dashboard." },
  { q: "Can I book walks for multiple dogs?", a: "Absolutely. Add each dog to your profile and select them when booking." },
  { q: "How are walkers screened?", a: "Every walker completes a background check, in-person interview, and canine first-aid training. All walkers are insured." },
  { q: "What happens if it rains?", a: "Light rain? We walk. In severe weather we'll reach out to reschedule at no cost." },
  { q: "How do I add tips?", a: "You can tip your walker after the walk from the booking details page." },
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">Frequently asked questions</h1>
      <p className="mt-3 text-muted-foreground">Everything you need to know before booking.</p>
      <Accordion type="single" collapsible className="mt-10 rounded-3xl border border-border/60 bg-card p-2 shadow-soft">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`i${i}`} className="border-b last:border-none">
            <AccordionTrigger className="px-4 text-left text-base font-semibold">{it.q}</AccordionTrigger>
            <AccordionContent className="px-4 text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}