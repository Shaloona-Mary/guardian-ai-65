import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Local mock data layer for the MVP.
 * Every mutation goes through this provider so that swapping localStorage for a
 * real Python/FastAPI backend later only requires changing this file.
 */

export type User = {
  name: string;
  email: string;
  userId: string;
  phone: string;
  password: string;
};

export type Contact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  userId: string;
  notified: boolean;
};

export type MedicalProfile = {
  bloodGroup: string;
  age: string;
  weight: string;
  height: string;
  conditions: string;
  medicines: string;
  allergies: string;
};

export type EventType =
  | "Fall Detected"
  | "False Alarm"
  | "Emergency Activated"
  | "Medical Alert"
  | "User Requested Help";

export type EmergencyEvent = {
  id: string;
  type: EventType;
  timestamp: string;
  status: "Resolved" | "Cancelled" | "Active" | "Logged";
  response: string;
};

export type PostureState = "Standing" | "Walking" | "Lying" | "Fall Detected";

export type LocationState = {
  sharing: boolean;
  lastUpdated: string;
  label: string;
  lat: number;
  lng: number;
  accuracy: number;
};

type Store = {
  ready: boolean;
  user: User | null;
  signup: (u: User) => { ok: boolean; error?: string };
  login: (id: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  contacts: Contact[];
  addContact: (c: Omit<Contact, "id" | "notified">) => void;
  updateContact: (id: string, c: Omit<Contact, "id" | "notified">) => void;
  deleteContact: (id: string) => void;
  medical: MedicalProfile;
  saveMedical: (m: MedicalProfile) => void;
  events: EmergencyEvent[];
  addEvent: (type: EventType, status: EmergencyEvent["status"], response: string) => void;
  posture: PostureState;
  setPosture: (p: PostureState) => void;
  fallAlert: boolean;
  setFallAlert: (v: boolean) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  location: LocationState;
  setSharing: (v: boolean) => void;
  refreshLocation: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const defaultMedical: MedicalProfile = {
  bloodGroup: "O+",
  age: "68",
  weight: "72 kg",
  height: "170 cm",
  conditions: "Hypertension, Type 2 Diabetes",
  medicines: "Metformin 500mg, Amlodipine 5mg",
  allergies: "Penicillin",
};

const defaultContacts: Contact[] = [
  {
    id: "c1",
    name: "Ayesha Khan",
    relationship: "Daughter",
    phone: "+92 300 1234567",
    userId: "ayesha.k",
    notified: true,
  },
  {
    id: "c2",
    name: "Dr. Imran Sheikh",
    relationship: "Family Doctor",
    phone: "+92 321 7654321",
    userId: "dr.imran",
    notified: true,
  },
];

const defaultEvents: EmergencyEvent[] = [
  {
    id: "e1",
    type: "False Alarm",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "Cancelled",
    response: "User confirmed they were OK within 20s",
  },
  {
    id: "e2",
    type: "Medical Alert",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(),
    status: "Resolved",
    response: "Medical profile shared with primary contact",
  },
];

const defaultLocation: LocationState = {
  sharing: true,
  lastUpdated: new Date().toISOString(),
  label: "Gulberg III, Lahore, Pakistan",
  lat: 31.5204,
  lng: 74.3587,
  accuracy: 12,
};

const KEY = "aea.state.v1";
const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [medical, setMedical] = useState<MedicalProfile>(defaultMedical);
  const [events, setEvents] = useState<EmergencyEvent[]>(defaultEvents);
  const [posture, setPosture] = useState<PostureState>("Standing");
  const [fallAlert, setFallAlert] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [location, setLocation] = useState<LocationState>(defaultLocation);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.user) setUser(s.user);
        if (s.account) setAccount(s.account);
        if (s.contacts) setContacts(s.contacts);
        if (s.medical) setMedical(s.medical);
        if (s.events) setEvents(s.events);
        if (s.location) setLocation(s.location);
        if (s.theme) setTheme(s.theme);
      }
    } catch {
      /* ignore corrupted state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ user, account, contacts, medical, events, location, theme }),
    );
  }, [ready, user, account, contacts, medical, events, location, theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addEvent = useCallback<Store["addEvent"]>((type, status, response) => {
    setEvents((prev) => [
      {
        id: Math.random().toString(36).slice(2),
        type,
        status,
        response,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready,
      user,
      signup: (u) => {
        setAccount(u);
        setUser(u);
        return { ok: true };
      },
      login: (id, password) => {
        const target =
          account ??
          ({
            name: "Demo User",
            email: "demo@guardian.ai",
            userId: "demo",
            phone: "+92 300 0000000",
            password: "demo1234",
          } satisfies User);
        if ((id === target.email || id === target.userId) && password === target.password) {
          setUser(target);
          return { ok: true };
        }
        return { ok: false, error: "Invalid credentials. Try demo / demo1234." };
      },
      logout: () => {
        setUser(null);
        setFallAlert(false);
        setEmergencyActive(false);
        setPosture("Standing");
      },
      contacts,
      addContact: (c) =>
        setContacts((prev) => [
          ...prev,
          { ...c, id: Math.random().toString(36).slice(2), notified: true },
        ]),
      updateContact: (id, c) =>
        setContacts((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x))),
      deleteContact: (id) => setContacts((prev) => prev.filter((x) => x.id !== id)),
      medical,
      saveMedical: setMedical,
      events,
      addEvent,
      posture,
      setPosture,
      fallAlert,
      setFallAlert,
      emergencyActive,
      setEmergencyActive,
      location,
      setSharing: (v) =>
        setLocation((prev) => ({ ...prev, sharing: v, lastUpdated: new Date().toISOString() })),
      refreshLocation: () =>
        setLocation((prev) => ({
          ...prev,
          lastUpdated: new Date().toISOString(),
          lat: +(prev.lat + (Math.random() - 0.5) * 0.001).toFixed(5),
          lng: +(prev.lng + (Math.random() - 0.5) * 0.001).toFixed(5),
          accuracy: Math.round(8 + Math.random() * 10),
        })),
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [
      ready,
      user,
      account,
      contacts,
      medical,
      events,
      addEvent,
      posture,
      fallAlert,
      emergencyActive,
      location,
      theme,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
