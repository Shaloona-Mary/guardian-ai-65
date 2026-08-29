import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, Footprints, PersonStanding, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp, type PostureState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fall-detection")({
  head: () => ({
    meta: [
      { title: "Fall Detection — Guardian AI" },
      {
        name: "description",
        content:
          "Simulated posture monitoring with a 20-second confirmation countdown before emergency contacts are alerted.",
      },
      { property: "og:title", content: "Fall Detection — Guardian AI" },
      {
        property: "og:description",
        content: "Posture monitoring with a 20-second confirmation countdown.",
      },
    ],
  }),
  component: FallDetection,
});

const postures: { key: PostureState; icon: typeof Activity; hint: string }[] = [
  { key: "Standing", icon: PersonStanding, hint: "Upright, stable" },
  { key: "Walking", icon: Footprints, hint: "Steady gait" },
  { key: "Lying", icon: Activity, hint: "Resting position" },
  { key: "Fall Detected", icon: AlertTriangle, hint: "Sudden impact" },
];

function FallDetection() {
  const {
    posture,
    setPosture,
    fallAlert,
    setFallAlert,
    setEmergencyActive,
    addEvent,
    contacts,
  } = useApp();
  const [count, setCount] = useState(20);

  useEffect(() => {
    if (!fallAlert) {
      setCount(20);
      return;
    }
    const t = window.setInterval(() => setCount((c) => c - 1), 1000);
    return () => window.clearInterval(t);
  }, [fallAlert]);

  useEffect(() => {
    if (fallAlert && count <= 0) {
      setFallAlert(false);
      setEmergencyActive(true);
      addEvent("Fall Detected", "Active", `No response in 20s — alerted ${contacts.length} contacts`);
      toast.error("No response — emergency escalated", {
        description: "Simulated alert sent to your emergency contacts.",
      });
    }
  }, [count, fallAlert, setFallAlert, setEmergencyActive, addEvent, contacts.length]);

  const trigger = () => {
    setPosture("Fall Detected");
    setFallAlert(true);
    setCount(20);
  };

  const confirmOk = () => {
    setFallAlert(false);
    setPosture("Standing");
    addEvent("False Alarm", "Cancelled", `User confirmed OK with ${count}s remaining`);
    toast.success("Marked as a false alarm");
  };

  const needHelp = () => {
    setFallAlert(false);
    setEmergencyActive(true);
    addEvent("User Requested Help", "Active", "Help requested from fall detection screen");
    toast.error("Help requested", { description: "Simulated alert sent to your contacts." });
  };

  return (
    <AppShell
      title="Fall Detection"
      subtitle="Simulated posture monitoring — no real sensors are connected."
    >
      <div className="space-y-6">
        {fallAlert && (
          <section className="surface border-emergency/50 bg-emergency-soft p-6 text-center sm:p-8">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emergency text-emergency-foreground pulse-ring">
              <Siren className="size-8" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-emergency">Possible fall detected</h2>
            <p className="mt-1 text-sm text-emergency/80">
              Confirm you are OK, otherwise contacts will be alerted automatically.
            </p>
            <p className="mt-6 font-display text-6xl font-extrabold tabular-nums text-emergency">
              {Math.max(count, 0)}s
            </p>
            <div className="mx-auto mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-emergency/20">
              <div
                className="h-full rounded-full bg-emergency transition-all duration-1000 ease-linear"
                style={{ width: `${(Math.max(count, 0) / 20) * 100}%` }}
              />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="xl" variant="safe" onClick={confirmOk}>
                I&apos;m OK
              </Button>
              <Button size="xl" variant="emergency" onClick={needHelp}>
                I need help
              </Button>
            </div>
          </section>
        )}

        <section className="surface p-6">
          <h3 className="text-base font-bold">Current posture</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a state to simulate what the monitoring layer would report.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {postures.map((p) => {
              const active = posture === p.key;
              const danger = p.key === "Fall Detected";
              return (
                <button
                  key={p.key}
                  onClick={() => (danger ? trigger() : (setPosture(p.key), setFallAlert(false)))}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    active
                      ? danger
                        ? "border-emergency bg-emergency-soft text-emergency"
                        : "border-primary bg-brand-soft text-primary"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <p.icon className="size-5" />
                  <p className="mt-3 text-sm font-bold">{p.key}</p>
                  <p className="text-xs text-muted-foreground">{p.hint}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Sensitivity", value: "Balanced" },
            { label: "Confirmation window", value: "20 seconds" },
            { label: "Contacts on alert", value: `${contacts.length}` },
          ].map((c) => (
            <div key={c.label} className="surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-1 text-lg font-bold">{c.value}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
