import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { SERVICES, TIME_SLOTS, useStore, serviceById } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings/new")({
  head: () => ({ meta: [{ title: "Book a Walk — Happy Paws" }] }),
  component: BookWalk,
});

const steps = ["Dog", "Service", "Date", "Time", "Notes", "Review"] as const;

function BookWalk() {
  const { user, dogs, addBooking, isSlotTaken } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dogIds, setDogIds] = useState<string[]>([]);
  const [serviceId, setServiceId] = useState<string>("walk-30");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (!user) return <Navigate to="/auth" />;

  const svc = serviceById(serviceId);
  const dateISO = date ? format(date, "yyyy-MM-dd") : "";
  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((t) => !dateISO || !isSlotTaken(dateISO, t)),
    [dateISO, isSlotTaken],
  );

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed =
    (step === 0 && dogIds.length > 0) ||
    (step === 1 && serviceId) ||
    (step === 2 && date) ||
    (step === 3 && time) ||
    step === 4 || step === 5;

  const submit = async () => {
    if (!svc || !dateISO || !time || dogIds.length === 0) return;
    try {
      const b = await addBooking({ dogIds, serviceId, date: dateISO, time, notes, price: svc.price });
      toast.success("🎉 Booking confirmed!");
      navigate({ to: "/bookings/$id", params: { id: b.id }, search: { just: "1" } as never });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm booking");
    }
  };

  if (dogs.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <PawPrint className="mx-auto h-10 w-10 text-primary/60" />
        <h1 className="mt-4 text-2xl font-bold">Add your dog first</h1>
        <p className="mt-2 text-muted-foreground">We need to know who we're walking!</p>
        <Button asChild className="mt-6 rounded-full gradient-primary text-white">
          <Link to="/dogs">Add a dog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">Book a walk</h1>

      {/* progress */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
              i < step ? "gradient-primary text-white" : i === step ? "bg-primary/10 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground",
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={cn("h-0.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Step {step + 1} of {steps.length}: {steps[step]}</p>

      <Card className="mt-6 rounded-3xl border-border/60 p-6 shadow-soft sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold">Which dog(s)?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select one or more.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {dogs.map((d) => {
                const on = dogIds.includes(d.id);
                return (
                  <button key={d.id} type="button" onClick={() => setDogIds((prev) => on ? prev.filter((i) => i !== d.id) : [...prev, d.id])}
                    className={cn("flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors", on ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><PawPrint className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="truncate font-semibold">{d.name}</p><p className="truncate text-xs text-muted-foreground">{d.breed}</p></div>
                    {on && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold">Choose a service</h2>
            <div className="mt-4 grid gap-3">
              {SERVICES.map((s) => {
                const on = serviceId === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => setServiceId(s.id)}
                    className={cn("flex items-center justify-between rounded-2xl border p-4 text-left transition-colors", on ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    <div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.description}</p></div>
                    <p className="font-bold">${s.price}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold">Pick a date</h2>
            <div className="mt-4 flex justify-center">
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} className="rounded-2xl border border-border/60 p-3 pointer-events-auto" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold">Available time slots</h2>
            <p className="mt-1 text-sm text-muted-foreground">For {dateISO}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableSlots.length === 0 ? (
                <p className="col-span-full text-sm text-muted-foreground">No slots available for this day. Try another date.</p>
              ) : availableSlots.map((t) => (
                <button key={t} type="button" onClick={() => setTime(t)}
                  className={cn("rounded-xl border py-2 text-sm font-medium transition-colors", time === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold">Anything special?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Optional requests for your walker.</p>
            <Textarea className="mt-4" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="E.g. Please avoid other dogs. Bella is a bit shy at first." />
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold">Review your booking</h2>
            <dl className="mt-4 space-y-2 rounded-2xl bg-muted/50 p-4 text-sm">
              <Row k="Service" v={svc?.name} />
              <Row k="Dog(s)" v={dogs.filter((d) => dogIds.includes(d.id)).map((d) => d.name).join(", ")} />
              <Row k="Date" v={dateISO} />
              <Row k="Time" v={time} />
              <Row k="Estimated arrival" v={`${time} ± 10 min`} />
              <Row k="Notes" v={notes || "—"} />
              <div className="my-2 border-t" />
              <Row k="Total" v={`$${svc?.price ?? 0}`} bold />
            </dl>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" className="rounded-full" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button className="rounded-full gradient-primary text-white" onClick={next} disabled={!canProceed}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-full gradient-primary text-white" onClick={submit}>Confirm Booking</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={cn("text-right", bold && "text-lg font-bold")}>{v}</dd>
    </div>
  );
}