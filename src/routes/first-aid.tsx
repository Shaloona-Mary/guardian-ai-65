import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Search, Filter, AlertTriangle, ShieldCheck, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { firstAidTopics, categoryMeta, type FirstAidCategory, type FirstAidTopic } from "@/lib/first-aid";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/first-aid")({
  head: () => ({
    meta: [
      { title: "First Aid Guides — Guardian AI" },
      {
        name: "description",
        content:
          "Categorized step-by-step first aid guidance for heart attack, CPR, severe bleeding, stroke, burns, poisoning and choking.",
      },
      { property: "og:title", content: "First Aid Guides — Guardian AI" },
      {
        property: "og:description",
        content: "Categorized CPR, burns, bleeding, stroke, choking and poisoning emergency guides.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirstAidPage,
});

const toneStyles: Record<FirstAidTopic["tone"], string> = {
  emergency: "bg-emergency-soft text-emergency border-emergency/30",
  warning: "bg-warning-soft text-warning-foreground border-warning/30",
  safe: "bg-safe-soft text-safe border-safe/30",
};

function FirstAidPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FirstAidCategory | "all">("all");
  const [open, setOpen] = useState<string | null>(firstAidTopics[0]?.slug ?? null);

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return firstAidTopics.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <AppShell
      title="Categorized First Aid Guides"
      subtitle="Structured step-by-step life saving procedures grouped by emergency type"
    >
      {/* Top Search & Filter Bar */}
      <div className="space-y-4">
        <div className="surface relative flex items-center gap-3 p-3.5 sm:p-4 shadow-card rounded-2xl border border-border transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-primary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Search first aid guides (CPR, tourniquet, burns, poisoning, stroke...)"
            aria-label="Search first aid guides"
            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {topics.length} found
              </span>
              <button
                onClick={() => setQuery("")}
                className="rounded-lg p-1 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground",
            )}
          >
            <span>✨ All Categories</span>
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px]">
              {firstAidTopics.length}
            </span>
          </button>

          {(Object.keys(categoryMeta) as FirstAidCategory[]).map((cat) => {
            const meta = categoryMeta[cat];
            const count = firstAidTopics.filter((t) => t.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground",
                )}
              >
                <span>{meta.icon}</span>
                <span>{meta.name}</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Grid grouped into structured layout */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {topics.map((t) => {
            const expanded = open === t.slug;
            return (
              <motion.article
                key={t.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="surface overflow-hidden rounded-2xl border border-border shadow-card transition-shadow hover:shadow-lift"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : t.slug)}
                  className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-accent/40"
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-2xl border text-xl font-bold shadow-xs",
                      toneStyles[t.tone],
                    )}
                  >
                    {categoryMeta[t.category]?.icon || "🩹"}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base font-bold text-foreground">{t.title}</h2>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold capitalize tracking-wide",
                          toneStyles[t.tone],
                        )}
                      >
                        {t.tone}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs font-medium text-muted-foreground leading-relaxed">
                      {t.summary}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                      <span>{t.categoryName}</span>
                    </span>
                  </span>

                  <ChevronDown
                    className={cn(
                      "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      expanded && "rotate-180 text-primary",
                    )}
                  />
                </button>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border bg-muted/20 px-5 py-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Step-by-Step Action Protocol
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-safe">
                        <ShieldCheck className="size-3.5" /> Medical Guidance
                      </span>
                    </div>

                    <ol className="space-y-3">
                      {t.steps.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-xs">
                            {i + 1}
                          </span>
                          <span className="mt-0.5 font-medium">{step}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-5 rounded-xl border border-emergency/20 bg-emergency/5 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-emergency" />
                        <span className="text-xs font-bold text-emergency">
                          In life-threatening situations, call 911 immediately while following steps.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {topics.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground py-8">
          <BookOpen className="mx-auto size-10 opacity-30 mb-3" />
          <p className="text-base font-semibold">No first aid guides match your search.</p>
          <p className="text-xs mt-1">Try searching for keywords like "CPR", "Burns", "Stroke" or reset filters.</p>
        </div>
      )}
    </AppShell>
  );
}
