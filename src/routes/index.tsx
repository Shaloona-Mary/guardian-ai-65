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
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { AppShell } from "@/components/AppShell";
import { LiveTriageDispatchMonitor } from "@/components/LiveTriageDispatchMonitor";
import { Button } from "@/components/ui/button";
import { formatDateTime, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safety & Emergency Dispatch Dashboard — Guardian AI" },
      {
        name: "description",
        content:
          "Live safety status, triage telemetry dispatch monitor, posture tracking and emergency contacts.",
      },
      { property: "og:title", content: "Safety & Dispatch Dashboard — Guardian AI" },
      {
        property: "og:description",
        content: "Live safety status, triage telemetry dispatch monitor and emergency contacts.",
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
    { label: "Current Posture", value: posture, icon: Activity, to: "/fall-detection" as const },
    { label: "Emergency Contacts", value: `${contacts.length}`, icon: Users, to: "/contacts" as const },
    { label: "Blood Group", value: medical.bloodGroup, icon: Heart, to: "/medical-profile" as const },
    {
      label: "Location Sharing",
      value: location.sharing ? "On (Active)" : "Off",
      icon: MapPin,
      to: "/location" as const,
    },
  ];

  return (
    <AppShell title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"}`} subtitle="Here is your live emergency & safety dispatch overview.">
      <div className="space-y-8">
        
        {/* Top Emergency Status Banner */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "surface overflow-hidden p-0 rounded-3xl border border-border shadow-card",
            emergencyActive && "border-emergency/40 bg-emergency-soft/20",
          )}
        >
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-2xl shadow-sm",
                  emergencyActive
                    ? "bg-emergency text-emergency-foreground pulse-ring"
                    : "bg-safe-soft text-safe",
                )}
              >
                {emergencyActive ? <Siren className="size-7 animate-bounce" /> : <ShieldCheck className="size-7" />}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Safety System Status
                </p>
                <h2 className="mt-1 font-display text-2xl font-black sm:text-3xl text-foreground">
                  {emergencyActive ? "Emergency Active — Dispatch Alert Sent" : "All Systems Safe & Monitoring"}
                </h2>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground leading-relaxed">
                  {emergencyActive
                    ? "Your emergency contacts and response teams have been notified with your real-time medical profile and GPS location."
                    : "Guardian AI is actively monitoring posture, vital fall telemetry, and emergency contacts 24/7."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0">
              {emergencyActive ? (
                <Button size="xl" variant="safe" onClick={resolve} className="w-full rounded-2xl shadow-md">
                  <ShieldCheck className="size-5" /> I&apos;m safe now
                </Button>
              ) : (
                <Button size="xl" variant="emergency" onClick={activate} className="w-full rounded-2xl shadow-md">
                  <Siren className="size-5" /> Activate Emergency
                </Button>
              )}
              <Button
                size="xl"
                variant="outline"
                className="w-full rounded-2xl"
                onClick={() => navigate({ to: "/fall-detection" })}
              >
                <Activity className="size-5" /> Simulate Fall
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Live Triage & Paramedic Dispatch Monitor (Reference Image replica) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-red-500/15 text-red-500">
                <Radio className="size-4 animate-pulse" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">Live Emergency Dispatch & Telemetry</h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground font-semibold">Triage Code RED</span>
          </div>

          <LiveTriageDispatchMonitor />
        </section>

        {/* Stat Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Link to={s.to} className="surface group block p-5 rounded-2xl border border-border transition-all hover:shadow-lift hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 truncate font-display text-xl font-black text-foreground">{s.value}</p>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Activity & Quick Actions */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="surface p-6 lg:col-span-2 rounded-2xl border border-border">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-bold text-foreground">Recent Activity Logs</h3>
              <Link to="/history" className="text-xs font-bold text-primary hover:underline">
                View All History →
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {events.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <History className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground">{e.type}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.response}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-mono text-muted-foreground">
                    {formatDateTime(e.timestamp)}
                  </span>
                </li>
              ))}
              {events.length === 0 && (
                <li className="py-6 text-sm text-muted-foreground">No events recorded yet.</li>
              )}
            </ul>
          </div>

          <div className="surface p-6 rounded-2xl border border-border">
            <h3 className="font-display text-base font-bold text-foreground">Emergency Quick Navigation</h3>
            <div className="mt-4 grid gap-2.5">
              <Link to="/first-aid" className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs font-bold transition-all hover:bg-accent hover:border-primary/40">
                <LifeBuoy className="size-4 text-primary" /> First Aid Guides
              </Link>
              <Link to="/contacts" className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs font-bold transition-all hover:bg-accent hover:border-primary/40">
                <Users className="size-4 text-primary" /> Nearby ER & Contacts
              </Link>
              <Link to="/medical-profile" className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs font-bold transition-all hover:bg-accent hover:border-primary/40">
                <Heart className="size-4 text-primary" /> Medical Profile
              </Link>
              <Link to="/location" className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs font-bold transition-all hover:bg-accent hover:border-primary/40">
                <MapPin className="size-4 text-primary" /> Live Location Sharing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
