import { createFileRoute } from "@tanstack/react-router";
import { Droplet, HeartPulse, Pill, Save, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp, type MedicalProfile } from "@/lib/store";

export const Route = createFileRoute("/medical-profile")({
  head: () => ({
    meta: [
      { title: "Medical Profile — Guardian AI" },
      {
        name: "description",
        content:
          "Store blood group, conditions, medicines and allergies so responders get critical details instantly.",
      },
      { property: "og:title", content: "Medical Profile — Guardian AI" },
      {
        property: "og:description",
        content: "Blood group, conditions, medicines and allergies for fast emergency response.",
      },
    ],
  }),
  component: MedicalProfilePage,
});

const fields: { key: keyof MedicalProfile; label: string; long?: boolean; placeholder: string }[] = [
  { key: "bloodGroup", label: "Blood group", placeholder: "O+" },
  { key: "age", label: "Age", placeholder: "68" },
  { key: "weight", label: "Weight", placeholder: "72 kg" },
  { key: "height", label: "Height", placeholder: "170 cm" },
  { key: "conditions", label: "Medical conditions", long: true, placeholder: "Hypertension, diabetes" },
  { key: "medicines", label: "Current medicines", long: true, placeholder: "Metformin 500mg" },
  { key: "allergies", label: "Allergies", long: true, placeholder: "Penicillin" },
];

function MedicalProfilePage() {
  const { medical, saveMedical } = useApp();
  const [form, setForm] = useState<MedicalProfile>(medical);

  const set = (k: keyof MedicalProfile, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AppShell
      title="Medical Profile"
      subtitle="Shared with responders and contacts when an emergency is activated."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <form
          className="surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveMedical(form);
            toast.success("Medical profile saved");
          }}
        >
          <h3 className="text-base font-bold">Health details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.long ? "sm:col-span-2" : undefined}>
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.long ? (
                  <Textarea
                    id={f.key}
                    className="mt-1.5"
                    rows={2}
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={f.key}
                    className="mt-1.5"
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
            <Save /> Save profile
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="surface p-6">
            <h3 className="text-base font-bold">Emergency card preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              What a responder would see on your device.
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={Droplet} label="Blood group" value={medical.bloodGroup} />
              <Row icon={HeartPulse} label="Conditions" value={medical.conditions} />
              <Row icon={Pill} label="Medicines" value={medical.medicines} />
              <Row icon={ShieldAlert} label="Allergies" value={medical.allergies} />
            </dl>
          </div>
          <div className="surface border-warning/40 bg-warning-soft p-5">
            <p className="text-sm font-semibold text-warning-foreground">Stored locally only</p>
            <p className="mt-1 text-xs text-warning-foreground/80">
              This MVP keeps medical data in your browser. No medical devices or health records are
              connected.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplet;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm font-medium">{value || "—"}</dd>
      </div>
    </div>
  );
}
