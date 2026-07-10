import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Happy Paws" },
      { name: "description", content: "Sign in or create your Happy Paws account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();
    setBusy(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
        setMode("login");
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success(`Welcome${name ? `, ${name}` : "!"}`);
        navigate({ to: "/dashboard" });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6">
      <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-soft">
        <PawPrint className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-3xl font-bold">Welcome to Happy Paws</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to book, manage, and track walks.</p>

      <div className="mt-8 w-full rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
        <Tabs value={mode === "reset" ? "login" : mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">Log in</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handle} className="mt-4 space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1.5" />
              </div>
              {mode !== "reset" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required autoComplete="current-password" className="mt-1.5" />
                </div>
              )}
              <Button type="submit" disabled={busy} className="w-full rounded-full gradient-primary text-white">
                {mode === "reset" ? "Send reset link" : "Log in"}
              </Button>
              <button type="button" onClick={() => setMode(mode === "reset" ? "login" : "reset")} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-primary">
                {mode === "reset" ? "Back to login" : "Forgot your password?"}
              </button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handle} className="mt-4 space-y-3">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" name="email" type="email" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password2">Password</Label>
                <Input id="password2" name="password" type="password" required minLength={6} className="mt-1.5" />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full gradient-primary text-white">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}