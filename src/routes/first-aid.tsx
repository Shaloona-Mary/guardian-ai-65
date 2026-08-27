import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { firstAidTopics, type FirstAidTopic } from "@/lib/first-aid";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/first-aid")({
  head: () => ({
    meta: [
      { title: "First Aid Guides — Guardian AI" },
      {
        name: "description",
        content:
          "Step-by-step first aid guidance for heart attack, CPR, burns, severe bleeding, stroke and choking.",
      },
      { property: "og:title", content: "First Aid Guides — Guardian AI" },
      {
        property: "og:description",
        content: "Clear steps for CPR, burns, bleeding, stroke, choking and heart attack.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirstAidPage,
});

const toneStyles: Record<FirstAidTopic["tone"], string> = {
  emergency: "bg-emergency-soft text-emergency",
  warning: "bg-warning-soft text-warning-foreground",
  safe: "bg-safe-soft text-safe",
};

function FirstAidPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(firstAidTopics[0]?.slug ?? null);

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return firstAidTopics;
    return firstAidTopics.filter(
      (t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AppShell
      title="First Aid Guides"
      subtitle="Concise, offline-friendly steps for common emergencies"
    >
      <div className="surface flex items-center gap-3 p-4">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides (CPR, burns, stroke…)"
          aria-label="Search first aid guides"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {topics.map((t) => {
          const expanded = open === t.slug;
          return (
            <article key={t.slug} className="surface overflow-hidden">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : t.slug)}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    toneStyles[t.tone],
                  )}
                >
                  <BookOpen className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold">{t.title}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        toneStyles[t.tone],
                      )}
                    >
                      {t.tone}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.summary}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>

              {expanded && (
                <ol className="space-y-3 border-t border-border px-5 py-5">
                  {t.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          );
        })}
      </div>

      {topics.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No guides match “{query}”.
        </p>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        These guides are general information for a UI demo and do not replace professional medical
        training or emergency services.
      </p>
    </AppShell>
  );
}
