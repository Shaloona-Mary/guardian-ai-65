import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Pencil, Phone, Plus, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Contact } from "@/lib/store";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Emergency Contacts — Guardian AI" },
      {
        name: "description",
        content:
          "Add, edit and remove the people notified when a fall or emergency is detected, with relationship and phone details.",
      },
      { property: "og:title", content: "Emergency Contacts — Guardian AI" },
      {
        property: "og:description",
        content: "Manage the people notified when an emergency is detected.",
      },
    ],
  }),
  component: ContactsPage,
});

type Draft = Omit<Contact, "id" | "notified">;
const empty: Draft = { name: "", relationship: "", phone: "", userId: "" };

function ContactsPage() {
  const { contacts, addContact, updateContact, deleteContact } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");

  const start = (c?: Contact) => {
    setEditing(c?.id ?? null);
    setDraft(c ? { name: c.name, relationship: c.relationship, phone: c.phone, userId: c.userId } : empty);
    setError("");
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.phone.trim() || !draft.relationship.trim()) {
      setError("Name, relationship and phone number are required.");
      return;
    }
    if (editing) {
      updateContact(editing, draft);
      toast.success("Contact updated");
    } else {
      addContact(draft);
      toast.success("Contact added");
    }
    setOpen(false);
  };

  return (
    <AppShell
      title="Emergency Contacts"
      subtitle="These people receive a simulated alert when an emergency is activated."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {contacts.length} contact{contacts.length === 1 ? "" : "s"} on your alert list
          </p>
          <Button onClick={() => start()}>
            <Plus /> Add contact
          </Button>
        </div>

        {contacts.length === 0 ? (
          <div className="surface grid place-items-center p-12 text-center">
            <UserPlus className="size-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">No contacts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add at least one person who should be notified in an emergency.
            </p>
            <Button className="mt-4" onClick={() => start()}>
              <Plus /> Add contact
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {contacts.map((c) => (
              <article key={c.id} className="surface flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-base font-bold text-primary">
                    {c.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.relationship}</p>
                  </div>
                  {c.notified && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-safe-soft px-2 py-1 text-[11px] font-semibold text-safe">
                      <BellRing className="size-3" /> Alerts on
                    </span>
                  )}
                </div>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" /> <span className="truncate">{c.phone}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">ID: {c.userId || "—"}</p>
                </dl>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => start(c)}>
                    <Pencil /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive"
                    onClick={() => {
                      deleteContact(c.id);
                      toast.success("Contact removed");
                    }}
                  >
                    <Trash2 /> Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="surface relative z-10 w-full max-w-md p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? "Edit contact" : "Add contact"}</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["name", "Full name", "Ayesha Khan"],
                  ["relationship", "Relationship", "Daughter"],
                  ["phone", "Phone number", "+92 300 1234567"],
                  ["userId", "User ID (optional)", "ayesha.k"],
                ] as const
              ).map(([key, label, ph]) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    className="mt-1.5"
                    placeholder={ph}
                    value={draft[key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <div className="mt-5 flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editing ? "Save changes" : "Add contact"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
