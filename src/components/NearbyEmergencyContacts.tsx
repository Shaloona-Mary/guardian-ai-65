import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, PhoneCall, Navigation, ShieldCheck, Clock, ExternalLink, Hospital, Flame, ShieldAlert, PhoneForwarded } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NearbyContact {
  id: string;
  name: string;
  category: "hospital" | "ambulance" | "police" | "fire" | "poison";
  distance: string;
  eta: string;
  phone: string;
  address: string;
  open247: boolean;
}

const nearbyFacilities: NearbyContact[] = [
  {
    id: "1",
    name: "Metro General Hospital Emergency ER",
    category: "hospital",
    distance: "1.2 km",
    eta: "4 mins drive",
    phone: "(555) 911-0199",
    address: "742 Medical Center Blvd",
    open247: true,
  },
  {
    id: "2",
    name: "Central Rapid Ambulance Station #12",
    category: "ambulance",
    distance: "0.8 km",
    eta: "3 mins response",
    phone: "(555) 911-0112",
    address: "104 Rescue Way",
    open247: true,
  },
  {
    id: "3",
    name: "National Poison Control Emergency Hotline",
    category: "poison",
    distance: "Toll-Free Nationwide",
    eta: "Instant 24/7 Hotline",
    phone: "1-800-222-1222",
    address: "National Emergency Dispatch Network",
    open247: true,
  },
  {
    id: "4",
    name: "West District Police Department",
    category: "police",
    distance: "2.5 km",
    eta: "6 mins drive",
    phone: "(555) 911-0100",
    address: "500 Justice Avenue",
    open247: true,
  },
  {
    id: "5",
    name: "City Fire & Heavy Rescue Station #4",
    category: "fire",
    distance: "1.8 km",
    eta: "5 mins drive",
    phone: "(555) 911-0144",
    address: "312 Beacon Street",
    open247: true,
  },
];

export function NearbyEmergencyContacts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered = nearbyFacilities.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-emergency/15 text-emergency">
              <PhoneForwarded className="size-4" />
            </span>
            <h3 className="font-display text-lg font-bold text-foreground">Nearby Emergency Contacts</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Instant dial for local ER hospitals, trauma units, police & rescue services
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-accent/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setSelectedCategory("hospital")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "hospital" ? "bg-primary text-primary-foreground" : "bg-accent/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setSelectedCategory("poison")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "poison" ? "bg-emergency text-emergency-foreground" : "bg-accent/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            Poison Control
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-xs transition-shadow hover:shadow-card"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.category === "hospital" && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <Hospital className="size-4" />
                    </span>
                  )}
                  {item.category === "ambulance" && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <PhoneCall className="size-4" />
                    </span>
                  )}
                  {item.category === "poison" && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                      <ShieldAlert className="size-4" />
                    </span>
                  )}
                  {item.category === "police" && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <ShieldCheck className="size-4" />
                    </span>
                  )}
                  {item.category === "fire" && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
                      <Flame className="size-4" />
                    </span>
                  )}
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="size-3" /> {item.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Clock className="size-3.5 text-primary" /> {item.eta}
                </span>
                <span className="rounded-md bg-safe/15 px-2 py-0.5 text-[10px] font-bold text-safe">
                  {item.distance}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/60">
              <a
                href={`tel:${item.phone.replace(/[^0-9]/g, "")}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                <PhoneCall className="size-3.5" /> Direct Dial
              </a>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl shrink-0"
                title="Get Directions"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(item.name + " " + item.address)}`, "_blank")}
              >
                <Navigation className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
