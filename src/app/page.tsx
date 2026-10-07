"use client";

import { useState } from "react";
import Link from "next/link";
import { SESSIONS, type Session } from "@/lib/schedule";
import { effectiveDate, markDone, markMissed, setNote, undo, useStore, type SessionRecord } from "@/lib/store";
import { addDays, parse, pretty, today } from "@/lib/dates";
import { readiness } from "@/lib/scoring";
import { TOPICS } from "@/data/plan";
import { useHydrated } from "@/lib/hydrated";
import { Btn, Card, StatusPill } from "@/components/ui";
import { StuckForm } from "@/components/StuckForm";
import { TopicTabs, allTopics } from "@/components/TopicTabs";

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function weekOf(d: string): string[] {
  const dow = (parse(d).getDay() + 6) % 7; // Monday = 0
  const mon = addDays(d, -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
}

interface Item { s: Session; rec?: SessionRecord; date: string }

export default function Today() {
  const hydrated = useHydrated();
  const state = useStore();
  const [picked, setPicked] = useState<string | null>(null);
  if (!hydrated) return <div className="h-96" />;

  const now = today();
  const date = picked ?? now;
  const topics = allTopics(state.extraTopics);
  const match = (s: Session) => state.filter === "all" || s.topicId === state.filter;

  const items: Item[] = SESSIONS.filter(match).map((s) => {
    const rec = state.sessions[s.id];
    return { s, rec, date: effectiveDate(s.date, rec) };
  });
  const forDay = (d: string) => items.filter((i) => i.date === d);

  // Carried-over: planned earlier, still not done. Shown only on today.
  const carried = date === now ? items.filter((i) => i.date < now && i.rec?.status !== "done") : [];
  const day = [...carried, ...forDay(date)];
  const firstPending = day.find((i) => i.rec?.status !== "done");

  const isTue = parse(date).getDay() === 2;
  const week = weekOf(date);
  const tomorrow = addDays(now, 1);
  const label = date === now ? "Today" : date === tomorrow ? "Tomorrow" : WD[parse(date).getDay()];

  return (
    <>
      <div className="mb-1 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{label}</h1>
          <p className="text-muted">{pretty(date)}</p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => setPicked(now)}>Today</Btn>
          <Btn onClick={() => setPicked(tomorrow)}>Tomorrow</Btn>
        </div>
      </div>

      {/* Week strip */}
      <div className="my-5 flex items-stretch gap-2">
        <button aria-label="Previous week" onClick={() => setPicked(addDays(date, -7))} className="rounded-lg border border-line bg-surface px-2 text-muted hover:bg-line/50">‹</button>
        <div className="grid flex-1 grid-cols-7 gap-1.5 md:gap-2">
          {week.map((d) => {
            const on = d === date;
            const isNow = d === now;
            const dayItems = forDay(d);
            return (
              <button
                key={d}
                onClick={() => setPicked(d)}
                className={`flex flex-col items-center rounded-xl border py-2 text-xs transition md:text-sm ${
                  on ? "border-accent bg-accent text-white shadow" : "border-line bg-surface hover:bg-line/50"
                }`}
              >
                <span className={on ? "text-white/80" : "text-muted"}>{WD[parse(d).getDay()]}</span>
                <span className={`text-base font-semibold md:text-lg ${isNow && !on ? "text-accent" : ""}`}>{parse(d).getDate()}</span>
                <span className="mt-1 flex h-2 gap-0.5">
                  {dayItems.slice(0, 3).map((i) => (
                    <span key={i.s.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: on ? "#fff" : topics.find((t) => t.id === i.s.topicId)?.color }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <button aria-label="Next week" onClick={() => setPicked(addDays(date, 7))} className="rounded-lg border border-line bg-surface px-2 text-muted hover:bg-line/50">›</button>
      </div>

      <TopicTabs />

      {isTue && (
        <Card className="mb-4 text-center">
          <p className="text-lg font-medium">Tuesday is off</p>
          <p className="text-sm text-muted">Nothing is ever scheduled on a Tuesday.</p>
        </Card>
      )}

      {!isTue && day.length === 0 && (
        <Card className="mb-4 text-center">
          <p className="font-medium">Nothing scheduled {state.filter !== "all" ? "for this topic " : ""}on this day.</p>
          <p className="mt-1 text-sm text-muted">
            {state.filter === "python"
              ? "Python isn't scheduled yet. Set it up on the Topics screen."
              : "Pick another day above, or switch topic."}
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {day.map((i) => {
          const t = topics.find((x) => x.id === i.s.topicId);
          const done = i.rec?.status === "done";
          const featured = i === firstPending && date === now;
          const actionable = date <= now && !done;
          return (
            <div
              key={i.s.id}
              className={`overflow-hidden rounded-xl border bg-surface shadow-sm ${featured ? "border-accent ring-1 ring-accent/40" : "border-line"} ${done ? "opacity-60" : ""}`}
            >
              <div className="flex">
                <div className="w-1.5 shrink-0" style={{ backgroundColor: t?.color }} />
                <div className="min-w-0 flex-1 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full px-2 py-0.5 font-medium text-white" style={{ backgroundColor: t?.color }}>{t?.short}</span>
                    <span className="text-muted">{i.s.id} · {i.s.slot} · {i.s.minutes} min</span>
                    {i.date < now && !done && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-600">carried over</span>}
                    {done && <span className="text-green-600">✓ done</span>}
                  </div>
                  <div className={`mt-1.5 font-medium ${featured ? "text-xl" : "text-base"}`}>{i.s.title}</div>
                  <div className="text-sm text-muted">{i.s.detail}</div>

                  {featured && (
                    <textarea
                      placeholder="Notes: what I learned / what confused me"
                      value={state.notes[i.s.id] ?? ""}
                      onChange={(e) => setNote(i.s.id, e.target.value)}
                      className="mt-3 w-full rounded-lg border border-line bg-transparent p-2 text-sm"
                      rows={2}
                    />
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/modules/${i.s.id}`} className="rounded-lg bg-foreground px-3.5 py-1.5 text-sm font-medium text-background hover:opacity-90">Open module</Link>
                    {actionable && <Btn kind="primary" onClick={() => markDone(i.s.id)}>Done</Btn>}
                    {actionable && <Btn onClick={() => markMissed(i.s.id, i.date)}>Didn&apos;t happen</Btn>}
                    {done && <Btn onClick={() => undo(i.s.id)}>Undo</Btn>}
                    {(actionable || done || featured) && <StuckForm topicId={i.s.topicId} sessionId={i.s.id} />}
                    {!actionable && !done && <span className="text-xs text-muted">Planned. Actions open on the day.</span>}
                    {featured && (i.s.kind === "quiz" || i.s.kind === "learn") && (
                      <Link href="/quiz" className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-line/40">Take a quiz</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-muted">Exam readiness</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.filter((t) => t.kind === "certification").map((t) => {
          const r = readiness(t, state.quizzes);
          return (
            <Card key={t.id}>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </div>
              {r ? (
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-light">{Math.round(r.score)}</span>
                  <StatusPill status={r.status} />
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted">Domains pending the official guide</div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
