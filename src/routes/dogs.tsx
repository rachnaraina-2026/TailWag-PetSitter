import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore, type Dog } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, PawPrint } from "lucide-react";

export const Route = createFileRoute("/dogs")({
  head: () => ({ meta: [{ title: "My Dogs — Happy Paws" }] }),
  component: Dogs,
});

const empty: Omit<Dog, "id"> = { name: "", breed: "", age: 1, weight: 10, energy: "Medium", medical: "", behavior: "", emergency: "", vet: "", feeding: "" };

function Dogs() {
  const { user, dogs, addDog, updateDog, removeDog } = useStore();
  const [editing, setEditing] = useState<Dog | null>(null);
  const [creating, setCreating] = useState(false);

  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">My Dogs</h1>
          <p className="mt-1 text-muted-foreground">Manage every pup on your Happy Paws profile.</p>
        </div>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button className="rounded-full gradient-primary text-white"><Plus className="mr-1 h-4 w-4" /> Add dog</Button>
          </DialogTrigger>
          <DogForm
            title="Add a dog"
            initial={empty}
            onSubmit={(d) => {
              addDog(d);
              toast.success(`${d.name} added!`);
              setCreating(false);
            }}
          />
        </Dialog>
      </div>

      {dogs.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-16 text-center shadow-soft">
          <PawPrint className="mx-auto h-10 w-10 text-primary/50" />
          <p className="mt-4 text-lg font-semibold">No dogs yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first pup to book a walk.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dogs.map((d) => (
            <div key={d.id} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
                  {d.photo ? <img src={d.photo} alt={d.name} className="h-full w-full object-cover" /> : <PawPrint className="h-7 w-7" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{d.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{d.breed} · {d.age}y · {d.weight}lb</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">{d.energy} energy</span>
                {d.behavior && <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">Behavior notes</span>}
                {d.medical && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">Medical notes</span>}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => setEditing(d)}>
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full text-destructive hover:text-destructive" onClick={() => { removeDog(d.id); toast.success(`${d.name} removed`); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <DogForm
            title="Edit dog"
            initial={editing}
            onSubmit={(d) => {
              updateDog(editing.id, d);
              toast.success("Saved!");
              setEditing(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function DogForm({ initial, onSubmit, title }: { initial: Omit<Dog, "id">; onSubmit: (d: Omit<Dog, "id">) => void; title: string }) {
  const [d, setD] = useState<Omit<Dog, "id">>(initial);
  const upd = <K extends keyof Omit<Dog, "id">>(k: K, v: Omit<Dog, "id">[K]) => setD((p) => ({ ...p, [k]: v }));
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!d.name.trim()) return toast.error("Name is required");
          onSubmit(d);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><Input value={d.name} onChange={(e) => upd("name", e.target.value)} maxLength={40} /></Field>
          <Field label="Breed"><Input value={d.breed} onChange={(e) => upd("breed", e.target.value)} maxLength={60} /></Field>
          <Field label="Age (years)"><Input type="number" min={0} max={30} value={d.age} onChange={(e) => upd("age", +e.target.value)} /></Field>
          <Field label="Weight (lb)"><Input type="number" min={1} max={300} value={d.weight} onChange={(e) => upd("weight", +e.target.value)} /></Field>
          <Field label="Energy level">
            <Select value={d.energy} onValueChange={(v) => upd("energy", v as Dog["energy"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Low", "Medium", "High"] as const).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Photo URL"><Input value={d.photo ?? ""} onChange={(e) => upd("photo", e.target.value)} placeholder="https://…" /></Field>
        </div>
        <Field label="Medical notes"><Textarea rows={2} value={d.medical} onChange={(e) => upd("medical", e.target.value)} maxLength={500} /></Field>
        <Field label="Behavioral notes"><Textarea rows={2} value={d.behavior} onChange={(e) => upd("behavior", e.target.value)} maxLength={500} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Emergency contact"><Input value={d.emergency} onChange={(e) => upd("emergency", e.target.value)} /></Field>
          <Field label="Veterinarian"><Input value={d.vet} onChange={(e) => upd("vet", e.target.value)} /></Field>
        </div>
        <Field label="Feeding instructions"><Textarea rows={2} value={d.feeding} onChange={(e) => upd("feeding", e.target.value)} maxLength={500} /></Field>
        <DialogFooter><Button type="submit" className="rounded-full gradient-primary text-white">Save</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>);
}