"use client";

import { TOPICS } from "@/data/plan";
import { setFilter, useStore, type ExtraTopic } from "@/lib/store";

export interface TopicView {
  id: string;
  name: string;
  short: string;
  color: string;
  kind: "certification" | "hands-on";
}

const EXTRA_COLOR = "#64748b";

export function allTopics(extra: ExtraTopic[]): TopicView[] {
  return [
    ...TOPICS.map((t) => ({ id: t.id, name: t.name, short: t.short, color: t.color, kind: t.kind })),
    ...extra.map((t) => ({ id: t.id, name: t.name, short: t.name, color: EXTRA_COLOR, kind: t.kind })),
  ];
}

export function topicColor(id: string, extra: ExtraTopic[] = []): string {
  return allTopics(extra).find((t) => t.id === id)?.color ?? EXTRA_COLOR;
}

/** Topic switcher: All, CCA-F, VS Code, Antigravity, Power BI, Python, Git + GitHub, ... Persisted. */
export function TopicTabs() {
  const { filter, extraTopics } = useStore();
  const topics = allTopics(extraTopics);
  const chips = [{ id: "all", short: "All", color: "#334155" }, ...topics];

  return (
    <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {chips.map((c) => {
        const on = filter === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={on ? { backgroundColor: c.color, borderColor: c.color } : { borderColor: "var(--line)" }}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              on ? "text-white shadow-sm" : "bg-surface text-foreground hover:bg-line/50"
            }`}
          >
            {!on && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />}
            {c.short}
          </button>
        );
      })}
    </div>
  );
}
