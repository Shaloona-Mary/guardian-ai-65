import { Bot, MessageCircle, Send, Siren, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Msg = { id: string; from: "ai" | "user"; text: string; at: string; alert?: boolean };

const uid = () => Math.random().toString(36).slice(2);
const now = () => new Date().toISOString();
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

function reply(input: string, ctx: { conditions: string; contacts: number; bloodGroup: string }) {
  const q = input.toLowerCase();
  if (q.includes("help") || q.includes("emergency"))
    return `I've flagged this as an emergency request. Your ${ctx.contacts} emergency contacts would be notified and your location shared. If this is life-threatening, call your local emergency number now.`;
  if (q.includes("medic") || q.includes("blood") || q.includes("condition"))
    return `Your saved profile lists blood group ${ctx.bloodGroup} and conditions: ${ctx.conditions || "none recorded"}. You can update this on the Medical Profile page.`;
  if (q.includes("fall"))
    return "Fall monitoring is a simulation in this MVP. Open Fall Detection to trigger a demo fall and see the 20-second emergency countdown.";
  if (q.includes("location"))
    return "Location sharing uses mock coordinates for now. Open Live Location to start or stop sharing with your contacts.";
  if (q.includes("cpr") || q.includes("burn") || q.includes("bleed") || q.includes("stroke"))
    return "Open the First Aid page for step-by-step guidance. It is general guidance only and does not replace professional emergency services.";
  if (q.includes("ok") || q.includes("fine"))
    return "Good to hear. I'll keep monitoring in the background and log this check-in.";
  return "I'm a simulated assistant for this prototype. I can help with fall alerts, your medical profile, emergency contacts, location sharing and first aid guidance.";
}

export function ChatAssistant() {
  const { fallAlert, medical, contacts, addEvent, setFallAlert, setPosture, setEmergencyActive } =
    useApp();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      from: "ai",
      text: "Hello, I'm your Guardian AI assistant. I'm monitoring your safety status. How can I help?",
      at: now(),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const alerted = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (fallAlert && !alerted.current) {
      alerted.current = true;
      setOpen(true);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          from: "ai",
          text: "I detected a possible fall. Are you okay?",
          at: now(),
          alert: true,
        },
      ]);
    }
    if (!fallAlert) alerted.current = false;
  }, [fallAlert]);

  const push = (msg: Omit<Msg, "id" | "at">) =>
    setMessages((m) => [...m, { ...msg, id: uid(), at: now() }]);

  const respond = (text: string) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({
        from: "ai",
        text: reply(text, {
          conditions: medical.conditions,
          contacts: contacts.length,
          bloodGroup: medical.bloodGroup,
        }),
      });
    }, 900);
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    push({ from: "user", text: value });
    setInput("");
    respond(value);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className={cn(
          "fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full text-primary-foreground shadow-lift transition-transform hover:scale-105",
          fallAlert ? "bg-emergency pulse-ring" : "bg-primary",
        )}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="surface fixed bottom-24 right-4 z-40 flex h-[520px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden p-0 shadow-lift">
          <div className="flex items-center gap-3 border-b border-border bg-navy px-4 py-3 text-navy-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-primary/25">
              <Bot className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Guardian AI Assistant</p>
              <p className="truncate text-xs text-navy-foreground/60">Simulated responses</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2", m.from === "user" ? "justify-end" : "justify-start")}
              >
                {m.from === "ai" && (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Bot className="size-4" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-card",
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : m.alert
                        ? "bg-emergency-soft text-emergency"
                        : "bg-card text-card-foreground",
                  )}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">{time(m.at)}</p>
                  {m.alert && fallAlert && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="safe"
                        onClick={() => {
                          setFallAlert(false);
                          setPosture("Standing");
                          addEvent("False Alarm", "Cancelled", "User confirmed OK in AI chat");
                          push({ from: "user", text: "I'm OK" });
                          respond("I'm ok");
                        }}
                      >
                        I&apos;m OK
                      </Button>
                      <Button
                        size="sm"
                        variant="emergency"
                        onClick={() => {
                          setFallAlert(false);
                          setEmergencyActive(true);
                          addEvent(
                            "User Requested Help",
                            "Active",
                            "Help requested from AI assistant",
                          );
                          push({ from: "user", text: "I need help" });
                          respond("help");
                        }}
                      >
                        I Need Help
                      </Button>
                    </div>
                  )}
                </div>
                {m.from === "user" && (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </span>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-primary/15 text-primary">
                  <Bot className="size-4" />
                </span>
                <div className="flex gap-1 rounded-2xl bg-card px-3 py-3 shadow-card">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border bg-card p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Button
              type="button"
              size="icon"
              variant="emergency"
              aria-label="Request emergency help"
              onClick={() => {
                setEmergencyActive(true);
                addEvent("User Requested Help", "Active", "Emergency button pressed in AI chat");
                push({ from: "user", text: "Emergency! I need help." });
                respond("emergency");
              }}
            >
              <Siren className="size-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              aria-label="Message"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
