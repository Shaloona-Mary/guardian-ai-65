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
  Bell,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ChatAssistant } from "@/components/ChatAssistant";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { NotificationDrawer } from "@/components/NotificationDrawer";
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

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
        <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary/25 text-primary-foreground shadow-sm">
          <ShieldPlus className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-400 animate-ping" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-extrabold tracking-tight">Guardian AI</p>
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

      <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-[11px] text-navy-foreground/60">ID: {user.userId}</p>
          </div>
        </div>
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
    <div className="min-h-screen bg-background font-sans">
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
        {/* Top Navbar Header aligned properly with equal spacing */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            
            {/* Left Side: Mobile Menu + Search Bar */}
            <div className="flex flex-1 items-center gap-3 min-w-0 max-w-md">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="rounded-xl border border-border p-2 hover:bg-accent lg:hidden transition-colors shrink-0"
              >
                <Menu className="size-5" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2.5 rounded-2xl border border-border bg-card/80 px-3.5 py-2 text-xs text-muted-foreground shadow-xs transition-all hover:bg-accent hover:border-primary/40 hover:shadow-sm"
                aria-label="Open search dialog"
              >
                <Search className="size-4 shrink-0 text-primary" />
                <span className="truncate font-medium">Search emergency guides, ERs, contacts...</span>
              </button>
            </div>

            {/* Right Side: Emergency Status Badge + Notifications + User Details + Dark Mode Toggle */}
            <div className="flex shrink-0 items-center gap-2.5">

              {/* Emergency Status Pill */}
              <span
                className={cn(
                  "hidden lg:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                  emergencyActive
                    ? "bg-emergency-soft text-emergency border border-emergency/30"
                    : "bg-safe-soft text-safe border border-safe/30",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    emergencyActive ? "bg-emergency animate-ping" : "bg-safe",
                  )}
                />
                {emergencyActive ? "Emergency Active" : "All Systems Normal"}
              </span>

              {/* Light & Dark Mode Toggle Button (between status pill and notification bell) */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-border hover:bg-accent"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
              </Button>

              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-xl border-border hover:bg-accent"
                  aria-label="Open notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="size-4 text-foreground" />
                  <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-emergency text-[10px] font-extrabold text-white">
                    3
                  </span>
                </Button>

                <NotificationDrawer
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>

              {/* User Profile Details Pill at Top Right */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 text-left transition-all hover:bg-accent"
                >
                  <div className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "AM"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="truncate text-xs font-bold text-foreground leading-none">{user.name}</p>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold mt-0.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>

                {/* User Profile Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-border bg-card p-2 shadow-lift"
                    >
                      <div className="border-b border-border p-2">
                        <p className="text-xs font-bold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.phone || "User ID: " + user.userId}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/medical-profile"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
                        >
                          <User className="size-4 text-primary" /> Medical Profile
                        </Link>
                        <Link
                          to="/contacts"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
                        >
                          <Users className="size-4 text-primary" /> Emergency Contacts
                        </Link>
                      </div>
                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            logout();
                            navigate({ to: "/login" });
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="size-4" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8">{children}</main>
      </div>

      <ChatAssistant />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
