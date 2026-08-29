import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, ShieldAlert, HeartPulse, Clock, Trash2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NotificationItem {
  id: string;
  type: "emergency" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "emergency",
    title: "Critical Triage Update",
    message: "Live dispatch initiated. Patient code RED — ETA 12 min to Metro ER.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Elevated Heart Rate Alert",
    message: "Spike detected: 115 bpm during resting period. Monitoring active.",
    time: "18 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Nearby ER Contact Synced",
    message: "Metro General Hospital emergency line synced to quick-dial.",
    time: "1 hour ago",
    read: true,
  },
];

export function NotificationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "emergency" | "warning">("all");

  const unreadCount = items.filter((i) => !i.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-xs"
          />

          {/* Floating Right Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="fixed right-4 top-16 z-50 w-[calc(100vw-2rem)] sm:w-[400px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Bell className="size-5 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-emergency text-[10px] font-extrabold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">Notifications & Alerts</h3>
                  <p className="text-xs text-muted-foreground">Emergency dispatches and system updates</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Close notifications"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Filter Tabs & Quick Action */}
            <div className="flex items-center justify-between border-b border-border bg-card px-5 py-2.5">
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setFilter("emergency")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    filter === "emergency" ? "bg-emergency text-white" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilter("warning")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    filter === "warning" ? "bg-warning text-warning-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Warnings
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border p-2 scrollbar-thin">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <CheckCircle2 className="mx-auto size-8 opacity-40 mb-2" />
                  <p className="text-sm font-medium">No notifications in this view</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`group relative flex gap-3.5 rounded-xl p-3.5 transition-colors ${
                      !item.read ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.type === "emergency" && (
                        <span className="grid size-8 place-items-center rounded-xl bg-emergency/15 text-emergency">
                          <ShieldAlert className="size-4 animate-pulse" />
                        </span>
                      )}
                      {item.type === "warning" && (
                        <span className="grid size-8 place-items-center rounded-xl bg-warning/15 text-warning-foreground">
                          <HeartPulse className="size-4" />
                        </span>
                      )}
                      {item.type === "info" && (
                        <span className="grid size-8 place-items-center rounded-xl bg-safe/15 text-safe">
                          <CheckCircle2 className="size-4" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="size-3" /> {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                      title="Dismiss notification"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
