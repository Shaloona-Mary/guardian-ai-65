import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, MapPin, ShieldPlus, Sun, Moon, HeartPulse } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Guardian AI Emergency Assistant" },
      {
        name: "description",
        content:
          "Sign in or create a Guardian AI account to monitor fall alerts, medical profile and emergency contacts.",
      },
      { property: "og:title", content: "Sign in — Guardian AI Emergency Assistant" },
      {
        property: "og:description",
        content: "Access your safety dashboard, fall detection monitor and emergency contacts.",
      },
    ],
  }),
  component: LoginPage,
});

type Errors = Record<string, string>;

function LoginPage() {
  const { login, signup, user, ready, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    userId: "",
    phone: "",
    password: "",
    identifier: "",
  });

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errors = {};

    if (mode === "login") {
      if (!form.identifier.trim()) err.identifier = "Enter your email or user ID";
      if (form.password.length < 6) err.password = "Password must be at least 6 characters";
      setErrors(err);
      if (Object.keys(err).length) return;
      const res = login(form.identifier.trim(), form.password);
      if (!res.ok) {
        setErrors({ password: res.error ?? "Login failed" });
        return;
      }
      toast.success("Welcome back — monitoring resumed");
      navigate({ to: "/" });
      return;
    }

    if (form.name.trim().length < 2) err.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) err.email = "Enter a valid email";
    if (form.userId.trim().length < 3) err.userId = "User ID must be at least 3 characters";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) err.phone = "Enter a valid phone number";
    if (form.password.length < 8) err.password = "Use at least 8 characters";
    setErrors(err);
    if (Object.keys(err).length) return;

    signup({
      name: form.name.trim(),
      email: form.email.trim(),
      userId: form.userId.trim(),
      phone: form.phone.trim(),
      password: form.password,
    });
    toast.success("Account created — your safety profile is active");
    navigate({ to: "/" });
  };

  const field = (
    id: string,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!errors[id]} {...props} />
      {errors[id] && <p className="text-xs font-medium text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-navy p-12 text-navy-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/25">
            <ShieldPlus className="size-6" />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold">Guardian AI</p>
            <p className="text-xs text-navy-foreground/60">Emergency Assistant</p>
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <h2 className="font-display text-4xl leading-tight font-extrabold">
            Calm, continuous protection for the people you care about.
          </h2>
          <p className="text-navy-foreground/70">
            Fall alerts, medical information, live location and emergency contacts — organised in
            one trustworthy place.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Activity, text: "Simulated fall monitoring with a 20-second grace window" },
              { icon: HeartPulse, text: "Medical profile ready for responders" },
              { icon: MapPin, text: "Location sharing status at a glance" },
            ].map((i) => (
              <li key={i.text} className="flex items-center gap-3 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10">
                  <i.icon className="size-4" />
                </span>
                {i.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-navy-foreground/50">
          Prototype interface. Fall detection, GPS and emergency calling are simulated and not
          connected to real services.
        </p>
      </section>

      <section className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldPlus className="size-5" />
              </span>
              <span className="font-display font-extrabold">Guardian AI</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto"
              aria-label="Toggle colour theme"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
          </div>

          <div className="surface p-6 sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setErrors({});
                  }}
                  className={cn(
                    "rounded-lg py-2 text-sm font-semibold transition-colors",
                    mode === m
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in with your email or user ID to resume monitoring."
                : "Set up your profile so responders get the right information."}
            </p>

            <form className="space-y-4" onSubmit={submit} noValidate>
              {mode === "signup" ? (
                <>
                  {field("name", "Full name", {
                    value: form.name,
                    onChange: set("name"),
                    placeholder: "Sara Ahmed",
                    autoComplete: "name",
                  })}
                  {field("email", "Email", {
                    value: form.email,
                    onChange: set("email"),
                    type: "email",
                    placeholder: "sara@example.com",
                    autoComplete: "email",
                  })}
                  {field("userId", "User ID", {
                    value: form.userId,
                    onChange: set("userId"),
                    placeholder: "sara.ahmed",
                  })}
                  {field("phone", "Phone number", {
                    value: form.phone,
                    onChange: set("phone"),
                    placeholder: "+92 300 1234567",
                    autoComplete: "tel",
                  })}
                  {field("password", "Password", {
                    value: form.password,
                    onChange: set("password"),
                    type: "password",
                    placeholder: "At least 8 characters",
                    autoComplete: "new-password",
                  })}
                </>
              ) : (
                <>
                  {field("identifier", "Email or user ID", {
                    value: form.identifier,
                    onChange: set("identifier"),
                    placeholder: "demo",
                    autoComplete: "username",
                  })}
                  {field("password", "Password", {
                    value: form.password,
                    onChange: set("password"),
                    type: "password",
                    placeholder: "demo1234",
                    autoComplete: "current-password",
                  })}
                </>
              )}

              <Button type="submit" size="lg" className="w-full">
                {mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>

            {mode === "login" && (
              <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-xs text-primary">
                Demo access — user ID <strong>demo</strong>, password <strong>demo1234</strong>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
