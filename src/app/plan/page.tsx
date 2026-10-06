"use client";

import { useState } from "react";
import { TOPICS, WEEKS } from "@/data/plan";
import { SESSIONS } from "@/lib/schedule";
import { effectiveDate, undo, useStore } from "@/lib/store";
import { addDays, pretty, today } from "@/lib/dates";
import { PLAN_START } from "@/data/plan";
import { useHydrated } from "@/lib/hydrated";
import { H1 } from "@/components/ui";

const BAR = { done: "border-green-500", missed: "border-amber-500", pending: "border-line" };

export default function Plan() {
  const hydrated = useHydrated();
  const state = useStore();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  if (!hydrated) return <H1>Plan</H1>;

  const now = today();
  const currentWeek =
    WEEKS.find((w) => now <= addDays(PLAN_START, (w.n - 1) * 7 + 6))?.n ?? WEEKS[WEEKS.length - 1].n;
  const isOpen = (n: number) => open[n] ?? n === currentWeek;

  return (
    <>
      <H1>Plan</H1>
      <div className="space-y-3">
        {WEEKS.map((w) => {
          const topic = TOPICS.find((t) => t.id === w.topicId);
          const start = addDays(PLAN_START, (w.n - 1) * 7);
          const sessions = SESSIONS.filter((s) => s.weekN === w.n);
          const done = sessions.filter((s) => state.sessions[s.id]?.status === "done").length;
          return (
            <div key={w.n} className="rounded-lg border border-line bg-surface">
              <button
                onClick={() => setOpen({ ...open, [w.n]: !isOpen(w.n) })}
                className="flex w-full items-center justify-between gap-3 bg-line/30 p-3 text-left"
              >
                <span>
                  <span className="mr-2 text-muted">{isOpen(w.n) ? "▾" : "▸"}</span>
                  <span className="font-medium">W{w.n}</span> · {topic?.name} · {w.title}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {pretty(start)} · {done}/{sessions.length}
                </span>
              </button>
              {isOpen(w.n) && (
                <div>
                  {sessions.map((s) => {
                    const rec = state.sessions[s.id];
                    const date = effectiveDate(s.date, rec);
                    const st = rec?.status ?? "pending";
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between gap-3 border-l-4 border-t border-t-line p-3 text-sm ${BAR[st]}`}
                      >
                        <span>
                          {st === "done" ? "✓" : st === "missed" ? "↻" : "○"} {s.id} · {s.title}
                        </span>
                        <span className="flex shrink-0 items-center gap-3 text-muted">
                          {pretty(date)}
                          {rec && (
                            <button onClick={() => undo(s.id)} className="text-xs underline">
                              undo
                            </button>
                          )}
                        </span>
                      </div>
                    );
                  })}
                  {w.retests.length > 0 && (
                    <div className="border-t border-line p-3 text-xs text-muted">
                      Review dates: {w.retests.map((d) => pretty(d)).join(" · ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
