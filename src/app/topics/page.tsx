"use client";

import { useState } from "react";
import { HOURS_PER_WEEK, TOPICS, WEEKS, PLAN_START } from "@/data/plan";
import { addTopic, removeTopic, useStore } from "@/lib/store";
import { addDays, pretty } from "@/lib/dates";
import { useHydrated } from "@/lib/hydrated";
import { Btn, Card, H1 } from "@/components/ui";

export default function Topics() {
  const hydrated = useHydrated();
  const state = useStore();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"certification" | "hands-on">("certification");
  const [hours, setHours] = useState(20);
  if (!hydrated) return <H1>Topics</H1>;

  const planEnd = addDays(PLAN_START, WEEKS.length * 7 - 1);
  // Queue-after: extra topics run back to back after the last planned week.
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

  return (
    <>
      <H1>Topics</H1>

      <div className="mb-8 divide-y divide-line rounded-lg border border-line bg-surface">
        {TOPICS.map((t) => (
          <div key={t.id} className="flex flex-wrap justify-between gap-2 p-3 text-sm">
            <span>{t.name} <span className="text-muted">· {t.kind}{t.cert ? ` · ${t.cert}` : ""}</span></span>
            <span className="text-muted">{t.examDate ? `Exam ${pretty(t.examDate)} (proposed)` : "Hands-on"}</span>
          </div>
        ))}
        {queued.map(({ t, weeks, start, end }) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <span>{t.name} <span className="text-muted">· {t.kind} · queued</span></span>
            <span className="flex items-center gap-3 text-muted">
              {pretty(start)} → {pretty(end)} ({weeks} wk)
              <button onClick={() => removeTopic(t.id)} className="text-xs underline">remove</button>
            </span>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-sm uppercase tracking-wide text-muted">Add a topic</h2>
      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Topic name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-line bg-transparent px-2 py-1.5 text-sm sm:col-span-3"
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "certification" | "hands-on")}
            className="rounded border border-line bg-surface px-2 py-1.5 text-sm"
          >
            <option value="certification">Certification</option>
            <option value="hands-on">Hands-on</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            Hours
            <input
              type="number"
              min={1}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded border border-line bg-transparent px-2 py-1.5"
            />
          </label>
        </div>
        <p className="mt-3 text-sm text-muted">
          At {HOURS_PER_WEEK} hrs/week this takes {previewWeeks} weeks. Queued after your current plan, the
          whole plan would end <b className="text-foreground">{pretty(previewEnd)}</b> (now{" "}
          {pretty(cursor)}).
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
