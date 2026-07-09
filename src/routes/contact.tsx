import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Happy Paws" },
      { name: "description", content: "Get in touch with the Happy Paws team. We reply within one business hour." },
      { property: "og:title", content: "Contact Happy Paws" },
      { property: "og:description", content: "Reach the Happy Paws team by email, phone, or the contact form." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — we'll be in touch shortly!");
      (e.target as HTMLFormElement).reset();
    }, 700);
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">Say hello</h1>
      <p className="mt-3 text-muted-foreground">We reply to every message within one business hour.</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required maxLength={80} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required maxLength={120} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" required maxLength={120} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required maxLength={1000} rows={5} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} className="rounded-full gradient-primary text-white">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
        <aside className="space-y-4">
          {[
            { icon: Mail, title: "Email", body: "hello@happypaws.co" },
            { icon: Phone, title: "Phone", body: "(555) 123-WALK" },
            { icon: Clock, title: "Hours", body: "Mon–Sun · 7am–7pm" },
            { icon: MapPin, title: "Emergency", body: "24/7 line: (555) 999-PAWS" },
          ].map((c) => (
            <div key={c.title} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
          <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-soft">
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              <MapPin className="mb-2 h-8 w-8 opacity-40" />
              <p>Google Maps</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}