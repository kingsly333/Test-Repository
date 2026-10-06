"use client";

import Link from "next/link";
import { TOPICS } from "@/data/plan";
import { SESSIONS } from "@/lib/schedule";
import { effectiveDate, markDone, markMissed, setNote, useStore } from "@/lib/store";
import { parse, pretty, today } from "@/lib/dates";
import { readiness } from "@/lib/scoring";
import { useHydrated } from "@/lib/hydrated";
import { Btn, Card, H1, StatusPill } from "@/components/ui";

export default function Today() {
  const hydrated = useHydrated();
  const state = useStore();
  if (!hydrated) return <H1>Today</H1>;

  const now = today();
  const isTuesday = parse(now).getDay() === 2;

  const pending = SESSIONS.filter((s) => state.sessions[s.id]?.status !== "done")
    .map((s) => ({ s, date: effectiveDate(s.date, state.sessions[s.id]) }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.s.id.localeCompare(b.s.id));

  const due = pending.filter((p) => p.date <= now);
  const upcoming = pending.filter((p) => p.date > now).slice(0, 4);
  const current = due[0];
  const topic = current && TOPICS.find((t) => t.id === current.s.topicId);
  const planStarted = now >= SESSIONS[0].date;

  return (
    <>
      <H1>Today · {pretty(now)}</H1>

      {isTuesday && (
        <Card className="mb-4">
          <p className="font-medium">Tuesday is off.</p>
          <p className="text-sm text-muted">Nothing scheduled. Rest.</p>
        </Card>
      )}

      {!planStarted && (
        <Card className="mb-4">
          <p className="text-sm text-muted">Plan starts {pretty(SESSIONS[0].date)}.</p>
        </Card>
      )}

      {current && !isTuesday && (
        <Card className="mb-6">
          <div className="text-xs uppercase tracking-wide text-muted">
            {topic?.name} · {current.s.id}
            {current.date < now && " · carried over"}
          </div>
          <div className="mt-1 text-xl">{current.s.title}</div>
          <div className="mt-1 text-sm text-muted">
            {current.s.slot} · {current.s.detail}
          </div>
          <textarea
            placeholder="Notes: what I learned / what confused me"
            value={state.notes[current.s.id] ?? ""}
            onChange={(e) => setNote(current.s.id, e.target.value)}
            className="mt-3 w-full rounded border border-line bg-transparent p-2 text-sm"
            rows={2}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn kind="primary" onClick={() => markDone(current.s.id)}>Done</Btn>
            <Btn onClick={() => markMissed(current.s.id, current.date)}>Didn&apos;t happen</Btn>
            {(current.s.kind === "quiz" || current.s.kind === "learn") && (
              <Link href="/quiz" className="rounded border border-line px-3 py-1.5 text-sm hover:bg-line/40">
                Take a quiz
              </Link>
            )}
          </div>
        </Card>
      )}

      {!current && planStarted && !isTuesday && (
        <Card className="mb-6">
          <p className="font-medium">Nothing due. You&apos;re up to date.</p>
        </Card>
      )}

      {due.length > 1 && (
        <p className="mb-4 text-sm text-muted">
          {due.length - 1} more carried-over session{due.length > 2 ? "s" : ""} waiting. They roll to the next
          Thu/Sat if you skip them.
        </p>
      )}

      <h2 className="mb-2 text-sm uppercase tracking-wide text-muted">Next up</h2>
      <div className="mb-8 divide-y divide-line rounded-lg border border-line bg-surface">
        {upcoming.map(({ s, date }) => (
          <div key={s.id} className="flex justify-between gap-3 p-3 text-sm">
            <span>{s.id} · {s.title}</span>
            <span className="shrink-0 text-muted">{pretty(date)}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-sm uppercase tracking-wide text-muted">Readiness</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.filter((t) => t.kind === "certification").map((t) => {
          const r = readiness(t, state.quizzes);
          return (
            <Card key={t.id}>
              <div className="text-sm">{t.name}</div>
              {r ? (
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-light">{Math.round(r.score)}</span>
                  <StatusPill status={r.status} />
                </div>
              ) : (
                <div className="mt-1 text-sm text-muted">Domains pending official guide</div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
