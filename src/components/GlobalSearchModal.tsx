import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  LifeBuoy,
  Heart,
  Users,
  Activity,
  MapPin,
  History,
  MessageCircle,
  LayoutDashboard,
  Siren,
  PhoneCall,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { firstAidTopics, categoryMeta } from "@/lib/first-aid";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchItem = {
  id: string;
  category: "Emergency Actions" | "First Aid Guides" | "Emergency Services" | "Navigation";
  title: string;
  description: string;
  icon: any;
  badge?: string;
  badgeTone?: "emergency" | "warning" | "safe" | "info";
  action: () => void;
};

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setEmergencyActive, addEvent } = useApp();

  // Reset search state on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keydown listeners (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // All searchable items
  const items: SearchItem[] = useMemo(() => {
    const list: SearchItem[] = [
      // Quick Emergency Actions
      {
        id: "action-activate-emergency",
        category: "Emergency Actions",
        title: "Activate SOS Emergency Alert",
        description: "Trigger immediate alert to 911 dispatch & emergency contacts",
        icon: Siren,
        badge: "CRITICAL",
        badgeTone: "emergency",
        action: () => {
          setEmergencyActive(true);
          addEvent("Emergency Activated", "Active", "Triggered via Global Search Bar");
          onClose();
          navigate({ to: "/" });
        },
      },
      {
        id: "action-call-poison",
        category: "Emergency Actions",
        title: "Call Poison Control Hotline (1-800-222-1222)",
        description: "Direct nationwide 24/7 toxic emergency guidance",
        icon: PhoneCall,
        badge: "24/7 Hotline",
        badgeTone: "warning",
        action: () => {
          window.open("tel:18002221222", "_self");
          onClose();
        },
      },

      // Navigation Pages
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Dashboard & Dispatch Status",
        description: "Overview of safety status, triage telemetry and emergency logs",
        icon: LayoutDashboard,
        action: () => {
          navigate({ to: "/" });
          onClose();
        },
      },
      {
        id: "nav-first-aid",
        category: "Navigation",
        title: "First Aid Guides & CPR Procedures",
        description: "Step-by-step emergency instructions for cardiac, burns & trauma",
        icon: LifeBuoy,
        badge: "Essential",
        badgeTone: "info",
        action: () => {
          navigate({ to: "/first-aid" });
          onClose();
        },
      },
      {
        id: "nav-fall-detection",
        category: "Navigation",
        title: "Fall Detection & Posture Telemetry",
        description: "Live sensor monitor, fall simulation and impact history",
        icon: Activity,
        action: () => {
          navigate({ to: "/fall-detection" });
          onClose();
        },
      },
      {
        id: "nav-medical-profile",
        category: "Navigation",
        title: "Medical Profile & Health Data",
        description: "Blood group, allergies, medications & emergency medical notes",
        icon: Heart,
        action: () => {
          navigate({ to: "/medical-profile" });
          onClose();
        },
      },
      {
        id: "nav-contacts",
        category: "Navigation",
        title: "Emergency Contacts & Nearby ERs",
        description: "Manage personal emergency network & locate nearby trauma centers",
        icon: Users,
        action: () => {
          navigate({ to: "/contacts" });
          onClose();
        },
      },
      {
        id: "nav-assistant",
        category: "Navigation",
        title: "Guardian AI Voice & Chat Assistant",
        description: "Instant medical protocol assistance powered by AI",
        icon: MessageCircle,
        action: () => {
          navigate({ to: "/assistant" });
          onClose();
        },
      },
      {
        id: "nav-location",
        category: "Navigation",
        title: "Live GPS Location Sharing",
        description: "Real-time location dispatch and emergency coordinates",
        icon: MapPin,
        action: () => {
          navigate({ to: "/location" });
          onClose();
        },
      },
      {
        id: "nav-history",
        category: "Navigation",
        title: "Emergency History & Activity Logs",
        description: "Past emergency alerts, timestamps and dispatch logs",
        icon: History,
        action: () => {
          navigate({ to: "/history" });
          onClose();
        },
      },
    ];

    // Add all First Aid Topics dynamically
    firstAidTopics.forEach((topic) => {
      const catMeta = categoryMeta[topic.category];
      list.push({
        id: `firstaid-${topic.slug}`,
        category: "First Aid Guides",
        title: topic.title,
        description: `${catMeta ? catMeta.icon + " " : ""}${topic.summary}`,
        icon: LifeBuoy,
        badge: topic.categoryName,
        badgeTone: topic.tone === "emergency" ? "emergency" : topic.tone === "warning" ? "warning" : "info",
        action: () => {
          navigate({ to: "/first-aid" });
          onClose();
        },
      });
    });

    return list;
  }, [navigate, onClose, setEmergencyActive, addEvent]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: SearchItem[] } = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      const catList = groups[item.category];
      if (catList) {
        catList.push(item);
      }
    });
    return groups;
  }, [filteredItems]);

  // Handle keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onKeyDown={handleKeyDown}
          >
            {/* Top Search Header Bar */}
            <div className="relative flex items-center border-b border-border px-5 py-4 bg-card">
              <Search className="size-5 text-muted-foreground shrink-0 mr-3.5" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search emergency guides, CPR, blood group, contacts, 911..."
                className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Global Search Input"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors mr-2"
                  aria-label="Clear search query"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0 ml-1"
                aria-label="Close search dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 scrollbar-thin">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3">
                    <Search className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-foreground">No matching search results found</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Try searching for emergency guides like &quot;CPR&quot;, &quot;Burns&quot;, &quot;Stroke&quot;, &quot;Blood Group&quot;, or &quot;Contacts&quot;.
                  </p>
                </div>
              ) : (
                Object.keys(groupedItems).map((categoryName) => (
                  <div key={categoryName} className="mb-4 last:mb-1">
                    <p className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {categoryName}
                    </p>
                    <div className="space-y-1">
                      {(groupedItems[categoryName] ?? []).map((item) => {
                        const globalIdx = filteredItems.findIndex((i) => i.id === item.id);
                        const isSelected = globalIdx === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={cn(
                              "group flex items-center justify-between gap-3 rounded-2xl px-3.5 py-3 cursor-pointer transition-all",
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "hover:bg-accent text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span
                                className={cn(
                                  "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : item.badgeTone === "emergency"
                                    ? "bg-emergency/15 text-emergency"
                                    : "bg-primary/10 text-primary"
                                )}
                              >
                                <Icon className="size-4" />
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={cn(
                                      "truncate text-sm font-bold",
                                      isSelected ? "text-white" : "text-foreground"
                                    )}
                                  >
                                    {item.title}
                                  </p>
                                  {item.badge && (
                                    <span
                                      className={cn(
                                        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                                        isSelected
                                          ? "bg-white/25 text-white"
                                          : item.badgeTone === "emergency"
                                          ? "bg-emergency-soft text-emergency"
                                          : item.badgeTone === "warning"
                                          ? "bg-warning-soft text-warning-foreground"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={cn(
                                    "truncate text-xs mt-0.5",
                                    isSelected ? "text-white/80" : "text-muted-foreground"
                                  )}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              className={cn(
                                "size-4 shrink-0 transition-transform",
                                isSelected ? "text-white translate-x-1" : "text-muted-foreground/40 opacity-0 group-hover:opacity-100"
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Keyboard Hint Bar */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-muted/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono shadow-xs">↑</kbd>
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono shadow-xs">↓</kbd>
                  <span className="ml-1 text-[11px]">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono shadow-xs">↵</kbd>
                  <span className="ml-1 text-[11px]">Select</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <Sparkles className="size-3 text-primary" /> Guardian AI Search
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
