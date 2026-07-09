import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { canCancel, hoursUntil, serviceById, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CalendarDays, Clock, MapPin, PawPrint, Download, Mail, ShieldAlert, Sparkles } from "lucide-react";

export const Route = createFileRoute("/bookings/$id")({
  head: () => ({ meta: [{ title: "Booking details — Happy Paws" }] }),
  component: BookingDetails,
});

function BookingDetails() {
  const { id } = Route.useParams();
  const search = (typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams());
  const justBooked = search.get("just") === "1";
  const { user, getBooking, cancelBooking, dogs } = useStore();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [cancelledFlash, setCancelledFlash] = useState(false);

  if (!user) return <Navigate to="/auth" />;
  const b = getBooking(id);
  if (!b) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold">Booking not found</p>
        <Button asChild className="mt-4 rounded-full"><Link to="/bookings">Back to bookings</Link></Button>
      </div>
    );
  }
  const svc = serviceById(b.serviceId);
  const dog = dogs.find((d) => b.dogIds.includes(d.id));
  const eligible = canCancel(b);
  const hoursLeft = Math.max(0, hoursUntil(b.date, b.time) - 24);

  const doCancel = () => {
    cancelBooking(b.id);
    setConfirm(false);
    setCancelledFlash(true);
    toast.success("Booking cancelled. Slot has been freed.");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {justBooked && !cancelledFlash && (
        <div className="mb-6 rounded-2xl gradient-hero p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <p className="font-bold">You're all set — walk confirmed!</p>
              <p className="text-sm text-muted-foreground">A confirmation email is on its way.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Booking {b.id}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{svc?.name}</h1>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{b.status}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info icon={CalendarDays} label="Date" value={b.date} />
        <Info icon={Clock} label="Time" value={b.time} />
        <Info icon={PawPrint} label="Dog" value={dog?.name ?? "—"} />
        <Info icon={ShieldAlert} label="Walker" value={b.walker} />
      </div>

      <div className="mt-6 rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
        <h2 className="text-lg font-bold">Details</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <Row k="Special instructions" v={b.notes || "—"} />
          <Row k="Price" v={`$${b.price}`} />
          <Row k="Payment status" v="Paid" />
          <Row k="Cancellation" v={eligible ? `Free cancellation for ${hoursLeft.toFixed(1)}h more` : "Within 24-hour window"} />
        </dl>

        <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted">
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            <MapPin className="mb-2 h-8 w-8 opacity-40" /> Live route map
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" className="rounded-full"><Download className="mr-1 h-4 w-4" /> Add to calendar</Button>
        <Button variant="outline" className="rounded-full"><Mail className="mr-1 h-4 w-4" /> Email receipt</Button>
        {b.status !== "Cancelled" && (
          eligible ? (
            <Button variant="destructive" className="rounded-full" onClick={() => setConfirm(true)}>Cancel booking</Button>
          ) : (
            <div className="w-full rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
              This booking cannot be cancelled because it is within our 24-hour cancellation window.
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/contact">Contact Support</Link></Button>
                <Button asChild size="sm" variant="ghost" className="rounded-full"><Link to="/faq">View policy</Link></Button>
              </div>
            </div>
          )
        )}
        <Button variant="ghost" className="rounded-full" onClick={() => navigate({ to: "/dashboard" })}>Back to dashboard</Button>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel this walk?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-2 space-y-1 text-sm">
                <p><b>Date:</b> {b.date}</p>
                <p><b>Time:</b> {b.time}</p>
                <p><b>Dog:</b> {dog?.name}</p>
                <p><b>Refund:</b> ${b.price.toFixed(2)} to original payment</p>
                <p><b>Deadline passed in:</b> {hoursLeft.toFixed(1)}h</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={doCancel}>Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="truncate font-semibold">{value}</p></div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>;
}