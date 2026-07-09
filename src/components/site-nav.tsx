import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, PawPrint } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const authedLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/dogs", label: "My Dogs" },
] as const;

export function SiteNav() {
  const { user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/12 data-[active=true]:text-primary"
      data-active={pathname === to}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-white shadow-soft">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Happy Paws
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} />
          ))}
          {user && authedLinks.map((l) => <NavLink key={l.to} to={l.to} label={l.label} />)}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/bookings/new">Book Walk</Link>
          </Button>
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <Button size="sm" variant="outline" className="rounded-full" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-full gradient-primary text-white shadow-soft">
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} label={l.label} />
            ))}
            {user && authedLinks.map((l) => <NavLink key={l.to} to={l.to} label={l.label} />)}
            <Link
              to="/bookings/new"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full gradient-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-soft"
            >
              Book a Walk
            </Link>
            {user ? (
              <Button variant="outline" className="mt-1 rounded-full" onClick={() => { logout(); setOpen(false); }}>
                Log out ({user.name})
              </Button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-center text-sm font-medium"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-white">
              <PawPrint className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Happy Paws
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Reliable, insured dog walking for busy pet parents.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services">All services</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/bookings/new">Book a walk</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>hello@happypaws.co</li>
            <li>(555) 123-WALK</li>
            <li>Mon–Sun · 7am–7pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Happy Paws Dog Walking · All rights reserved
      </div>
    </footer>
  );
}