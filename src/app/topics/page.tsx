"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HOURS_PER_WEEK, TOPICS, WEEKS, PLAN_START } from "@/data/plan";
import { SESSIONS } from "@/lib/schedule";
import { addTopic, effectiveDate, removeTopic, setFilter, useStore } from "@/lib/store";
import { addDays, pretty, today } from "@/lib/dates";
import { useHydrated } from "@/lib/hydrated";
import { Btn, Card, H1 } from "@/components/ui";

export default function Topics() {
  const hydrated = useHydrated();
  const state = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"certification" | "hands-on">("hands-on");
  const [hours, setHours] = useState(20);
  if (!hydrated) return <div className="h-96" />;

  const now = today();
  const planEnd = addDays(PLAN_START, WEEKS.length * 7 - 1);
  const queued = state.extraTopics.reduce<
    { t: (typeof state.extraTopics)[number]; weeks: number; start: string; end: string }[]
  >((acc, t) => {
    const from = acc.length ? acc[acc.length - 1].end : planEnd;
    const weeks = Math.ceil(t.hours / HOURS_PER_WEEK);
    return [...acc, { t, weeks, start: addDays(from, 1), end: addDays(from, weeks * 7) }];
  }, []);
  const cursor = queued.length ? queued[queued.length - 1].end : planEnd;
  const previewWeeks = Math.ceil(hours / HOURS_PER_WEEK);
  const previewEnd = addDays(cursor, previewWeeks * 7);

  function open(id: string) {
    setFilter(id);
    router.push("/plan");
  }

  return (
    <>
      <H1 sub="Tap a topic to see only its plan">Topics</H1>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.map((t) => {
          const mine = SESSIONS.filter((s) => s.topicId === t.id);
          const done = mine.filter((s) => state.sessions[s.id]?.status === "done").length;
          const next = mine
            .filter((s) => state.sessions[s.id]?.status !== "done")
            .map((s) => ({ s, d: effectiveDate(s.date, state.sessions[s.id]) }))
            .sort((a, b) => a.d.localeCompare(b.d))
            .find((x) => x.d >= now) ?? null;
          return (
            <button
              key={t.id}
              onClick={() => open(t.id)}
              className="overflow-hidden rounded-xl border border-line bg-surface text-left shadow-sm transition hover:shadow-md"
            >
              <div className="h-1.5" style={{ backgroundColor: t.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold">{t.short}</span>
                  <span className="rounded-full bg-line/60 px-2 py-0.5 text-[11px] text-muted">
                    {t.kind === "certification" ? "Certification" : "Hands-on"}
                  </span>
                </div>
                <div className="text-sm text-muted">{t.cert ?? (t.name !== t.short ? t.name : "")}</div>
                {mine.length > 0 ? (
                  <>
                    <div className="mt-3 text-sm">{done}/{mine.length} sessions done</div>
                    <div className="mt-1 text-xs text-muted">
                      {next ? `Next: ${next.s.id} · ${pretty(next.d)}` : "All sessions done"}
                      {t.examDate && ` · Exam ${pretty(t.examDate)} (proposed)`}
                    </div>
                  </>
                ) : (
                  <div className="mt-3 text-sm text-amber-600">{t.note ?? "Not scheduled yet"}</div>
                )}
              </div>
            </button>
          );
        })}
        {queued.map(({ t, weeks, start, end }) => (
          <Card key={t.id} className="relative">
            <div className="text-lg font-semibold">{t.name}</div>
            <div className="text-sm text-muted">{t.kind === "certification" ? "Certification" : "Hands-on"} · queued</div>
            <div className="mt-2 text-sm">{pretty(start)} → {pretty(end)} ({weeks} wk)</div>
            <button onClick={() => removeTopic(t.id)} className="mt-1 text-xs underline text-muted">remove</button>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-muted">Add a topic</h2>
      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Topic name (e.g. Python)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm sm:col-span-3"
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "certification" | "hands-on")}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          >
            <option value="hands-on">Hands-on</option>
            <option value="certification">Certification</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            Hours
            <input
              type="number"
              min={1}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-lg border border-line bg-transparent px-3 py-2"
            />
          </label>
        </div>
        <p className="mt-3 text-sm text-muted">
          At {HOURS_PER_WEEK} hrs/week this takes {previewWeeks} weeks. Queued after your current plan, the
          whole plan would end <b className="text-foreground">{pretty(previewEnd)}</b> (now {pretty(cursor)}).
        </p>
        <div className="mt-3">
          <Btn
            kind="primary"
            disabled={!name.trim()}
            onClick={() => {
              addTopic({ id: `x-${Date.now()}`, name: name.trim(), kind, hours });
              setName("");
            }}
          >
            Add topic
          </Btn>
        </div>
      </Card>
    </>
  );
}
