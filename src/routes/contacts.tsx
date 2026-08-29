import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Pencil, Phone, Plus, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { AppShell } from "@/components/AppShell";
import { NearbyEmergencyContacts } from "@/components/NearbyEmergencyContacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Contact } from "@/lib/store";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Emergency Contacts & Nearby ER — Guardian AI" },
      {
        name: "description",
        content:
          "Manage personal emergency contacts and view nearby emergency services, trauma ER units and poison control hotlines.",
      },
      { property: "og:title", content: "Emergency Contacts & Nearby ER — Guardian AI" },
      {
        property: "og:description",
        content: "Manage contacts notified during emergencies and locate nearby ER facilities.",
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
      title="Emergency Contacts & Services"
      subtitle="Personal emergency contacts and instant 24/7 nearby emergency response hotlines"
    >
      <div className="space-y-8">
        {/* Nearby Emergency Services Component */}
        <NearbyEmergencyContacts />

        {/* Personal Contacts Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Personal Designated Contacts</h3>
              <p className="text-xs text-muted-foreground">
                {contacts.length} designated contact{contacts.length === 1 ? "" : "s"} alerted during automated emergency activation
              </p>
            </div>
            <Button onClick={() => start()} className="rounded-xl shadow-xs">
              <Plus className="size-4" /> Add Personal Contact
            </Button>
          </div>

          {contacts.length === 0 ? (
            <div className="surface grid place-items-center p-12 text-center rounded-2xl">
              <UserPlus className="size-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">No personal contacts added yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add at least one person who should be notified when a fall or emergency is triggered.
              </p>
              <Button className="mt-4 rounded-xl" onClick={() => start()}>
                <Plus /> Add contact
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {contacts.map((c) => (
                <motion.article
                  key={c.id}
                  whileHover={{ y: -3 }}
                  className="surface flex flex-col p-5 rounded-2xl border border-border shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
                      {c.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-foreground">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.relationship}</p>
                    </div>
                    {c.notified && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-safe/15 px-2.5 py-1 text-[11px] font-bold text-safe">
                        <BellRing className="size-3" /> Alerts On
                      </span>
                    )}
                  </div>
                  <dl className="mt-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4 text-primary" /> <span className="truncate">{c.phone}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">ID: {c.userId || "—"}</p>
                  </dl>
                  <div className="mt-4 flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => start(c)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        deleteContact(c.id);
                        toast.success("Contact removed");
                      }}
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="surface relative z-10 w-full max-w-md p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editing ? "Edit Contact" : "Add Personal Contact"}</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["name", "Full Name", "Ayesha Khan"],
                  ["relationship", "Relationship", "Daughter"],
                  ["phone", "Phone Number", "+92 300 1234567"],
                  ["userId", "User ID (optional)", "ayesha.k"],
                ] as const
              ).map(([key, label, ph]) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    className="mt-1.5 rounded-xl"
                    placeholder={ph}
                    value={draft[key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <div className="mt-5 flex gap-2">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl">
                {editing ? "Save Changes" : "Add Contact"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
