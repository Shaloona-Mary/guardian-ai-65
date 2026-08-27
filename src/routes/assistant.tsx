import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Guardian AI" },
      {
        name: "description",
        content:
          "Simulated safety assistant that walks you through emergency steps, first aid basics and app guidance.",
      },
      { property: "og:title", content: "AI Assistant — Guardian AI" },
      {
        property: "og:description",
        content: "A guided, simulated assistant for emergency steps and first aid basics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { id: string; role: "user" | "bot"; text: string };

const prompts = [
  "What should I do if someone faints?",
  "How do I add an emergency contact?",
  "Explain the fall detection countdown",
  "Give me CPR steps",
];

function answer(input: string, ctx: { conditions: string; contacts: number; bloodGroup: string }) {
  const q = input.toLowerCase();
  if (q.includes("cpr"))
    return "CPR basics: check response, call emergency services, then 30 chest compressions (5-6 cm deep, 100-120/min) followed by 2 rescue breaths if trained. Use an AED as soon as it arrives. Full guide is on the First Aid page.";
  if (q.includes("faint") || q.includes("unconscious"))
    return "Lay the person flat, raise their legs slightly, loosen tight clothing and check breathing. If they do not wake within a minute or stop breathing normally, call emergency services and start CPR.";
  if (q.includes("contact"))
    return `You currently have ${ctx.contacts} emergency contact${ctx.contacts === 1 ? "" : "s"}. Open Emergency Contacts and use "Add contact" to include a name, relationship and phone number.`;
  if (q.includes("fall") || q.includes("countdown"))
    return "When a fall pattern is simulated, a 20-second countdown starts. Tap \"I'm OK\" to cancel it; otherwise the app logs a simulated alert to your contacts.";
  if (q.includes("medical") || q.includes("blood"))
    return `Your saved profile lists blood group ${ctx.bloodGroup} and conditions: ${ctx.conditions || "none recorded"}. Keep it updated so responders see it instantly.`;
  if (q.includes("burn"))
    return "Cool the burn under cool running water for 20 minutes, remove tight items near the area, and cover loosely with cling film. Never apply ice, butter or creams.";
  if (q.includes("help") || q.includes("emergency"))
    return "If this is a real emergency, call your local emergency number now. Inside the app you can tap Activate Emergency on the dashboard to log a simulated alert.";
  return "I can guide you through first aid steps, explain how fall detection works, or help you manage contacts and your medical profile. This is a simulated assistant, not medical advice.";
}

function AssistantPage() {
  const { medical, contacts } = useApp();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello, I'm your Guardian assistant. Ask me about first aid steps, fall detection or your profile. I'm a simulation and cannot contact emergency services.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), role: "user", text: value },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          role: "bot",
          text: answer(value, {
            conditions: medical.conditions,
            contacts: contacts.length,
            bloodGroup: medical.bloodGroup,
          }),
        },
      ]);
      setTyping(false);
    }, 650);
  };

  return (
    <AppShell
      title="AI Assistant"
      subtitle="Simulated guidance for emergencies, first aid and app setup"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <section className="surface flex h-[32rem] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-primary">
              <Bot className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Guardian Assistant</h2>
              <p className="text-xs text-muted-foreground">Simulated responses — not medical advice</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    m.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-brand-soft text-primary",
                  )}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <p
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <p className="text-xs text-muted-foreground">Assistant is typing…</p>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about first aid, contacts or fall detection…"
              aria-label="Message the assistant"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </section>

        <aside className="surface h-fit p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" /> Suggested questions
          </h2>
          <ul className="mt-4 space-y-2">
            {prompts.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => send(p)}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            In a real emergency call your local emergency number. This assistant is a UI simulation.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
