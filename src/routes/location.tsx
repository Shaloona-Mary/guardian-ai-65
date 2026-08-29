import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, MapPin, RefreshCw, Share2, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatDateTime, useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Live Location — Guardian AI" },
      {
        name: "description",
        content:
          "Simulated live location sharing so your emergency contacts can see your last known position and accuracy.",
      },
      { property: "og:title", content: "Live Location — Guardian AI" },
      {
        property: "og:description",
        content: "Share a simulated last known position with your emergency contacts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { location, setSharing, refreshLocation, contacts } = useApp();

  return (
    <AppShell title="Live Location" subtitle="Simulated position sharing with your trusted contacts">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface overflow-hidden">
          <div className="relative h-72 bg-brand-soft">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
              aria-hidden
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span
                className={`mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground ${
                  location.sharing ? "pulse-ring" : ""
                }`}
              >
                <MapPin className="size-7" />
              </span>
              <p className="mt-3 text-sm font-semibold">{location.label}</p>
              <p className="text-xs text-muted-foreground">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)} · ±{location.accuracy} m
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Last updated {formatDateTime(location.lastUpdated)} · illustrative map, not real GPS
            </p>
            <Button
              variant="soft"
              onClick={() => {
                refreshLocation();
                toast.success("Simulated position refreshed");
              }}
            >
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </div>
        </section>

        <div className="space-y-6">
          <section className="surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Share2 className="size-4 text-primary" /> Location sharing
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  When on, contacts receive your position with every simulated alert.
                </p>
              </div>
              <Switch
                checked={location.sharing}
                onCheckedChange={(v) => {
                  setSharing(v);
                  toast(v ? "Sharing enabled" : "Sharing paused");
                }}
                aria-label="Toggle location sharing"
              />
            </div>
            <p
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                location.sharing
                  ? "bg-safe-soft text-safe"
                  : "bg-warning-soft text-warning-foreground"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              {location.sharing ? "Visible to contacts" : "Paused"}
            </p>
          </section>

          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Crosshair className="size-4 text-primary" /> Who can see it
            </h2>
            <ul className="mt-4 space-y-3">
              {contacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="font-medium">{c.name}</span>
                    <span className="block text-xs text-muted-foreground">{c.relationship}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {location.sharing && c.notified ? "Receiving" : "Not receiving"}
                  </span>
                </li>
              ))}
              {contacts.length === 0 && (
                <li className="text-sm text-muted-foreground">No contacts added yet.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
