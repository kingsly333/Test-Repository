"use client";

import { use } from "react";
import Link from "next/link";
import { EXAM_FACTS, EXERCISES, GUIDE, R, SESSION_TASKS, TASK_BY_ID, type Resource } from "@/data/modules";
import { PY_BY_WEEK } from "@/data/python";
import { LABS, TOPICS, WEEKS } from "@/data/plan";
import { SESSION_BY_ID } from "@/lib/schedule";
import { effectiveDate, markDone, markMissed, setNote, undo, useStore } from "@/lib/store";
import { pretty, today } from "@/lib/dates";
import { useHydrated } from "@/lib/hydrated";
import { Btn, Card } from "@/components/ui";

// Which official preparation exercise (Exam Guide section 8) fits which session.
const EXERCISE_FOR: Record<string, string> = { "W1.2": "E2", "W3.2": "E4", "W4.2": "E1", "W5.2": "E3" };

function Links({ items }: { items: Resource[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm">
      {items.map((r) => (
        <li key={r.url}>
          <a href={r.url} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">
            {r.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useHydrated();
  const state = useStore();
  const s = SESSION_BY_ID[id];
  if (!hydrated) return <div className="h-96" />;
  if (!s) {
    return (
      <Card>
        <p>No such session: {id}</p>
        <Link href="/plan" className="text-accent underline">Back to plan</Link>
      </Card>
    );
  }

  const week = WEEKS.find((w) => w.n === s.weekN)!;
  const topic = TOPICS.find((t) => t.id === s.topicId);
  const weekTopic = TOPICS.find((t) => t.id === week.topicId);
  const rec = state.sessions[id];
  const date = effectiveDate(s.date, rec);
  const now = today();
  const done = rec?.status === "done";
  const actionable = date <= now && !done;

  const tasks = (SESSION_TASKS[id] ?? []).map((t) => TASK_BY_ID[t]);
  const weekTasks = Object.entries(SESSION_TASKS)
    .filter(([k]) => k.startsWith(`W${s.weekN}.`))
    .flatMap(([, v]) => v)
    .map((t) => TASK_BY_ID[t]);
  const py = PY_BY_WEEK[s.weekN];
  const exercise = EXERCISES.find((e) => e.id === EXERCISE_FOR[id]);
  const lab = LABS.find((l) => l.id === s.topicId);
  const isCcafStudy = week.topicId === "ccaf" && s.topicId === "ccaf";
  const accent = topic?.color ?? "#64748b";

  return (
    <>
      <Link href="/plan" className="text-sm text-muted hover:underline">← Plan</Link>
      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <div className="h-1.5" style={{ backgroundColor: accent }} />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full px-2 py-0.5 font-medium text-white" style={{ backgroundColor: accent }}>{topic?.short}</span>
            <span className="text-muted">{s.id} · Week {s.weekN} · {pretty(date)} · {s.slot} · {s.minutes} min</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{s.title}</h1>
          <p className="text-sm text-muted">{s.detail}</p>
        </div>
      </div>

      {/* CCA-F learn sessions: official task statements */}
      {tasks.length > 0 && (
        <div className="mt-6 space-y-4">
          {s.weekN === 1 && s.id === "W1.1" && (
            <Card>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Start here: how the exam works</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {EXAM_FACTS.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Links items={[GUIDE]} />
            </Card>
          )}
          {tasks.map((t) => (
            <Card key={t.id}>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Task statement {t.id} · {weekTopic?.domains.find((d) => d.id === t.domainId)?.name}
              </div>
              <h2 className="mt-1 text-lg font-semibold">{t.title}</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {t.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <Links items={t.refs.map((r) => R[r])} />
              <p className="mt-3 text-xs text-muted">Source: CCA-F Exam Guide v1.0, section 6, task statement {t.id}.</p>
            </Card>
          ))}
          {exercise && (
            <Card>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Hands-on exercise · {exercise.id} ({exercise.domains})</div>
              <h2 className="mt-1 text-lg font-semibold">{exercise.title}</h2>
              <p className="mt-2 text-sm">{exercise.summary}</p>
              <p className="mt-3 text-xs text-muted">Source: CCA-F Exam Guide v1.0, section 8. Do it on Friday or catch-up time.</p>
            </Card>
          )}
        </div>
      )}

      {/* CCA-F Sunday quiz: recap of the week */}
      {isCcafStudy && s.kind === "quiz" && (
        <Card className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">This week&apos;s task statements to recall</div>
          <ul className="mt-2 space-y-1 text-sm">
            {weekTasks.map((t) => <li key={t.id}><b>{t.id}</b> {t.title}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted">Say each one&apos;s key points out loud without notes, then open the module to check.</p>
        </Card>
      )}

      {/* CCA-F mock / exam */}
      {isCcafStudy && (s.kind === "mock" || s.kind === "exam" || s.weekN >= 7) && s.kind !== "quiz" && (
        <Card className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Exam facts</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {EXAM_FACTS.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Mock exams need the question bank (not built yet). Until then: re-read the weakest domain&apos;s modules and redo
            the four preparation exercises.
          </p>
          <Links items={[GUIDE]} />
        </Card>
      )}

      {/* Python */}
      {s.topicId === "python" && py && (
        <Card className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Goal</div>
          <p className="mt-1 text-lg">{py.goal}</p>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Read (official Python docs)</div>
          <Links items={py.read} />
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Practice</div>
          <p className="mt-1 text-sm">{py.practice}</p>
          <p className="mt-3 text-xs text-muted">Source: docs.python.org/3/tutorial</p>
        </Card>
      )}

      {/* Labs with no written content yet */}
      {s.kind === "lab" && s.topicId !== "python" && (
        <Card className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Lab</div>
          <p className="mt-1 text-sm">
            Hands-on session for <b>{topic?.name}</b>. Tick off the lab checklist as you go (pass = 4 of 5).
          </p>
          {lab && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {lab.checklist.map((c) => <li key={c}>{c}</li>)}
            </ul>
          )}
          <p className="mt-3 text-sm text-amber-600">
            Step-by-step content for this lab isn&apos;t written yet: it needs research from the tool&apos;s official docs.
          </p>
          <div className="mt-3"><Link href="/labs" className="text-accent underline">Open the lab checklist</Link></div>
        </Card>
      )}

      {/* Topics with no content yet */}
      {tasks.length === 0 && s.topicId !== "python" && s.topicId !== "ccaf" && s.kind !== "lab" && (
        <Card className="mt-6">
          <p className="font-medium">Module content for {topic?.name} isn&apos;t written yet.</p>
          <p className="mt-1 text-sm text-muted">
            It will be built from the official study guide for this topic, with sources cited. CCA-F and Python are done first.
          </p>
        </Card>
      )}

      <Card className="mt-6">
        <textarea
          placeholder="Notes: what I learned / what confused me"
          value={state.notes[id] ?? ""}
          onChange={(e) => setNote(id, e.target.value)}
          className="w-full rounded-lg border border-line bg-transparent p-2 text-sm"
          rows={3}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {actionable && <Btn kind="primary" onClick={() => markDone(id)}>Done</Btn>}
          {actionable && <Btn onClick={() => markMissed(id, date)}>Didn&apos;t happen</Btn>}
          {done && <Btn onClick={() => undo(id)}>Undo done</Btn>}
          {done && <span className="self-center text-sm text-green-600">✓ done</span>}
          {!actionable && !done && <span className="self-center text-xs text-muted">Actions open on the day.</span>}
        </div>
      </Card>
    </>
  );
}
