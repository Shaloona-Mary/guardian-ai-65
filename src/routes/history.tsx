import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, Clock, Filter, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatDateTime, useApp, type EmergencyEvent } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Emergency History — Guardian AI" },
      {
        name: "description",
        content:
          "Review every simulated fall alert, false alarm and emergency activation with time, status and response taken.",
      },
      { property: "og:title", content: "Emergency History — Guardian AI" },
      {
        property: "og:description",
        content: "A timeline of simulated alerts, false alarms and responses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const filters = ["All", "Resolved", "Cancelled", "Active", "Logged"] as const;

const statusStyles: Record<EmergencyEvent["status"], string> = {
  Resolved: "bg-safe-soft text-safe",
  Cancelled: "bg-muted text-muted-foreground",
  Active: "bg-emergency-soft text-emergency",
  Logged: "bg-warning-soft text-warning-foreground",
};

function HistoryPage() {
  const { events } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const list = useMemo(
    () => (filter === "All" ? events : events.filter((e) => e.status === filter)),
    [events, filter],
  );

  const stats = [
    { label: "Total events", value: events.length, icon: Activity },
    {
      label: "Resolved",
      value: events.filter((e) => e.status === "Resolved").length,
      icon: CheckCircle2,
    },
    {
      label: "False alarms",
      value: events.filter((e) => e.type === "False Alarm").length,
      icon: ShieldAlert,
    },
  ];

  return (
    <AppShell title="Emergency History" subtitle="Every simulated alert, with status and response">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="size-3.5" /> Filter
        </span>
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "soft"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <section className="surface mt-4 divide-y divide-border">
        {list.map((e) => (
          <article key={e.id} className="flex flex-wrap items-start gap-4 p-5">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                e.status === "Active"
                  ? "bg-emergency-soft text-emergency"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              <ShieldAlert className="size-5" />
            </span>
            <div className="min-w-48 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">{e.type}</h2>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusStyles[e.status],
                  )}
                >
                  {e.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.response}</p>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {formatDateTime(e.timestamp)}
            </p>
          </article>
        ))}
        {list.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No events match this filter yet.
          </p>
        )}
      </section>
    </AppShell>
  );
}
