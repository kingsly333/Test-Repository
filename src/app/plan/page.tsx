"use client";

import { useState } from "react";
import { PLAN_START, WEEKS } from "@/data/plan";
import { SESSIONS } from "@/lib/schedule";
import { effectiveDate, undo, useStore } from "@/lib/store";
import { addDays, pretty, today } from "@/lib/dates";
import { useHydrated } from "@/lib/hydrated";
import { H1 } from "@/components/ui";
import { TopicTabs, allTopics } from "@/components/TopicTabs";

export default function Plan() {
  const hydrated = useHydrated();
  const state = useStore();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  if (!hydrated) return <div className="h-96" />;

  const topics = allTopics(state.extraTopics);
  const now = today();
  const currentWeek =
    WEEKS.find((w) => now <= addDays(PLAN_START, (w.n - 1) * 7 + 6))?.n ?? WEEKS[WEEKS.length - 1].n;
  const isOpen = (n: number) => open[n] ?? (state.filter === "all" ? n === currentWeek : true);

  const weeks = WEEKS.map((w) => ({
    w,
    sessions: SESSIONS.filter((s) => s.weekN === w.n && (state.filter === "all" || s.topicId === state.filter)),
  })).filter((x) => x.sessions.length > 0);

  const picked = topics.find((t) => t.id === state.filter);

  return (
    <>
      <H1 sub="Week by week, with review dates and exams">Plan</H1>
      <TopicTabs />

      {weeks.length === 0 && (
        <div className="rounded-xl border border-line bg-surface p-5 text-center shadow-sm">
          <p className="font-medium">{picked?.name} has no sessions scheduled yet.</p>
          <p className="mt-1 text-sm text-muted">Set its hours on the Topics screen and it will be queued after the current plan.</p>
        </div>
      )}

      <div className="space-y-3">
        {weeks.map(({ w, sessions }) => {
          const t = topics.find((x) => x.id === w.topicId);
          const start = addDays(PLAN_START, (w.n - 1) * 7);
          const done = sessions.filter((s) => state.sessions[s.id]?.status === "done").length;
          return (
            <div key={w.n} className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
              <button
                onClick={() => setOpen({ ...open, [w.n]: !isOpen(w.n) })}
                className="flex w-full items-center justify-between gap-3 bg-line/30 p-3.5 text-left"
              >
                <span className="min-w-0">
                  <span className="mr-2 text-muted">{isOpen(w.n) ? "▾" : "▸"}</span>
                  <span className="font-semibold">Week {w.n}</span>
                  <span className="text-muted"> · {t?.short} · </span>
                  {w.title}
                </span>
                <span className="shrink-0 text-xs text-muted">{pretty(start)} · {done}/{sessions.length}</span>
              </button>
              {isOpen(w.n) && (
                <div>
                  {sessions.map((s) => {
                    const rec = state.sessions[s.id];
                    const date = effectiveDate(s.date, rec);
                    const st = rec?.status ?? "pending";
                    const sc = topics.find((x) => x.id === s.topicId);
                    return (
                      <div key={s.id} className="flex items-stretch border-t border-line text-sm">
                        <div className="w-1.5 shrink-0" style={{ backgroundColor: sc?.color }} />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3">
                          <span className={st === "done" ? "text-muted line-through" : ""}>
                            <span className="mr-2">{st === "done" ? "✓" : st === "missed" ? "↻" : "○"}</span>
                            <span className="text-muted">{s.id}</span> · {s.title}
                            {sc && sc.id !== w.topicId && (
                              <span className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ backgroundColor: sc.color }}>{sc.short}</span>
                            )}
                          </span>
                          <span className="flex shrink-0 items-center gap-3 text-muted">
                            {pretty(date)}
                            {rec && <button onClick={() => undo(s.id)} className="text-xs underline">undo</button>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {w.retests.length > 0 && (
                    <div className="border-t border-line bg-line/20 p-3 text-xs text-muted">
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
