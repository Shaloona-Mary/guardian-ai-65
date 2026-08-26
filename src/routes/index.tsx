import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Heart,
  History,
  LifeBuoy,
  MapPin,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatDateTime, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safety Dashboard — Guardian AI" },
      {
        name: "description",
        content:
          "Live safety status, posture monitoring, emergency contacts and one-tap emergency activation in a single dashboard.",
      },
      { property: "og:title", content: "Safety Dashboard — Guardian AI" },
      {
        property: "og:description",
        content: "Live safety status, posture monitoring and one-tap emergency activation.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    user,
    contacts,
    events,
    posture,
    emergencyActive,
    setEmergencyActive,
    addEvent,
    location,
    medical,
  } = useApp();
  const navigate = useNavigate();

  const safe = !emergencyActive && posture !== "Fall Detected";

  const activate = () => {
    setEmergencyActive(true);
    addEvent("Emergency Activated", "Active", `Alert sent to ${contacts.length} contacts`);
    toast.error("Emergency activated", {
      description: "Simulated alert sent to all emergency contacts.",
    });
  };

  const resolve = () => {
    setEmergencyActive(false);
    addEvent("Emergency Activated", "Resolved", "Marked safe by user");
    toast.success("Marked as safe", { description: "Contacts notified that you are OK." });
  };

  const stats = [
    { label: "Current posture", value: posture, icon: Activity, to: "/fall-detection" as const },
    { label: "Emergency contacts", value: `${contacts.length}`, icon: Users, to: "/contacts" as const },
    { label: "Blood group", value: medical.bloodGroup, icon: Heart, to: "/medical-profile" as const },
    {
      label: "Location sharing",
      value: location.sharing ? "On" : "Off",
      icon: MapPin,
      to: "/location" as const,
    },
  ];

  return (
    <AppShell title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"}`} subtitle="Here is your live safety overview.">
      <div className="space-y-6">
        <section
          className={cn(
            "surface overflow-hidden p-0",
            emergencyActive && "border-emergency/40",
          )}
        >
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-2xl",
                  emergencyActive
                    ? "bg-emergency-soft text-emergency pulse-ring"
                    : "bg-safe-soft text-safe",
                )}
              >
                {emergencyActive ? <Siren className="size-7" /> : <ShieldCheck className="size-7" />}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Safety status
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {emergencyActive ? "Emergency active" : "You are safe"}
                </h2>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                  {emergencyActive
                    ? "Your emergency contacts have been notified with your medical profile and last known location."
                    : "Monitoring is simulated for this MVP. No real sensors, GPS or emergency services are connected."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              {emergencyActive ? (
                <Button size="xl" variant="safe" onClick={resolve} className="w-full">
                  <ShieldCheck /> I&apos;m safe now
                </Button>
              ) : (
                <Button size="xl" variant="emergency" onClick={activate} className="w-full">
                  <Siren /> Activate emergency
                </Button>
              )}
              <Button
                size="xl"
                variant="outline"
                className="w-full"
                onClick={() => navigate({ to: "/fall-detection" })}
              >
                <Activity /> Simulate fall
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} to={s.to} className="surface group p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-primary">
                  <s.icon className="size-5" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 truncate text-xl font-bold">{s.value}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="surface p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold">Recent activity</h3>
              <Link to="/history" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {events.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <History className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.type}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.response}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(e.timestamp)}
                  </span>
                </li>
              ))}
              {events.length === 0 && (
                <li className="py-6 text-sm text-muted-foreground">No events recorded yet.</li>
              )}
            </ul>
          </div>

          <div className="surface p-6">
            <h3 className="text-base font-bold">Quick actions</h3>
            <div className="mt-4 grid gap-2">
              <Link to="/first-aid" className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                <LifeBuoy className="size-4 text-primary" /> First aid guides
              </Link>
              <Link to="/contacts" className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                <Users className="size-4 text-primary" /> Manage contacts
              </Link>
              <Link to="/medical-profile" className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                <Heart className="size-4 text-primary" /> Medical profile
              </Link>
              <Link to="/location" className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                <MapPin className="size-4 text-primary" /> Live location
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
