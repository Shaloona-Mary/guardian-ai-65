import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ChevronRight,
  Heart,
  History,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  ShieldPlus,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { ChatAssistant } from "@/components/ChatAssistant";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fall-detection", label: "Fall Detection", icon: Activity },
  { to: "/medical-profile", label: "Medical Profile", icon: Heart },
  { to: "/contacts", label: "Emergency Contacts", icon: Users },
  { to: "/assistant", label: "AI Assistant", icon: MessageCircle },
  { to: "/location", label: "Live Location", icon: MapPin },
  { to: "/history", label: "Emergency History", icon: History },
  { to: "/first-aid", label: "First Aid", icon: LifeBuoy },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, ready, logout, theme, toggleTheme, emergencyActive } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 bg-navy p-5 text-navy-foreground">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/25 text-primary-foreground">
          <ShieldPlus className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-extrabold">Guardian AI</p>
          <p className="truncate text-xs text-navy-foreground/60">Emergency Assistant</p>
        </div>
        <button
          className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-foreground/70 transition-colors hover:bg-white/10 hover:text-navy-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <item.icon className="size-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
            <ChevronRight className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-60" />
          </Link>
        ))}
      </nav>

      <div className="rounded-xl bg-white/5 p-3">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-navy-foreground/60">ID: {user.userId}</p>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/10"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-lift">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-border p-2 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex",
                  emergencyActive
                    ? "bg-emergency-soft text-emergency"
                    : "bg-safe-soft text-safe",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    emergencyActive ? "bg-emergency" : "bg-safe",
                  )}
                />
                {emergencyActive ? "Emergency active" : "All systems normal"}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8">{children}</main>
      </div>

      <ChatAssistant />
    </div>
  );
}
