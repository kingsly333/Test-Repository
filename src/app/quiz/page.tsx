"use client";

import { useState } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/plan";
import { SESSION_TASKS, TASK_BY_ID } from "@/data/modules";
import { SCENARIOS, citedQuestions, type Question } from "@/data/questions";
import { addStuck, recordAnswers, recordQuiz, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/hydrated";
import { Bar, Btn, Card, H1 } from "@/components/ui";

type Mode = "practice" | "exam";
type Answers = Record<string, number[]>;

const LETTER = (i: number) => String.fromCharCode(65 + i);
const isOk = (q: Question, picks: number[] = []) =>
  picks.length === q.answer.length && q.answer.every((a) => picks.includes(a));
const barColor = (pct: number) => (pct >= 80 ? "bg-green-500" : pct >= 65 ? "bg-amber-500" : "bg-red-500");

/** Session that teaches a task statement, for the "relearn" link. */
function sessionFor(taskId?: string): string | undefined {
  return Object.entries(SESSION_TASKS).find(([, tasks]) => tasks.includes(taskId ?? ""))?.[0];
}

/** Unseen first, then previously missed, then previously correct. Grouped by scenario like the real exam. */
function pickQuestions(bank: Question[], count: number, answered: Record<string, { ok: boolean }>): Question[] {
  const rank = (q: Question) => (!answered[q.id] ? 0 : answered[q.id].ok ? 2 : 1);
  const shuffled = [...bank].sort(() => Math.random() - 0.5).sort((a, b) => rank(a) - rank(b));
  const chosen = shuffled.slice(0, count).map(shuffleChoices);
  const order = Object.keys(SCENARIOS);
  return chosen.sort((a, b) => order.indexOf(a.scenarioId ?? "") - order.indexOf(b.scenarioId ?? ""));
}

/** Random answer order at serve time, so the correct answer is not always in the same slot. */
function shuffleChoices(q: Question): Question {
  const order = q.choices.map((_, i) => i).sort(() => Math.random() - 0.5);
  return {
    ...q,
    choices: order.map((i) => q.choices[i]),
    answer: q.answer.map((a) => order.indexOf(a)),
  };
}

export default function Quiz() {
  const hydrated = useHydrated();
  const state = useStore();
  const certTopics = TOPICS.filter((t) => t.kind === "certification");
  const [topicId, setTopicId] = useState(certTopics[0].id);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<Mode>("practice");

  const [run, setRun] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [stuckAdded, setStuckAdded] = useState<string[]>([]);

  if (!hydrated) return <div className="h-96" />;

  const topic = TOPICS.find((t) => t.id === topicId)!;
  const bank = citedQuestions(topicId);
  const unseen = bank.filter((q) => !state.answered[q.id]).length;
  const toReview = bank.filter((q) => state.answered[q.id] && !state.answered[q.id].ok).length;

  function start() {
    setRun(pickQuestions(bank, count, state.answered));
    setI(0);
    setPicks([]);
    setRevealed(false);
    setAnswers({});
    setDone(false);
    setStuckAdded([]);
  }

  function toggle(q: Question, idx: number) {
    if (revealed) return;
    if (q.answer.length === 1) return setPicks([idx]);
    if (picks.includes(idx)) return setPicks(picks.filter((p) => p !== idx));
    if (picks.length < q.answer.length) setPicks([...picks, idx]);
  }

  function finish(finalAnswers: Answers) {
    if (!run) return;
    const byDomain = new Map<string, { correct: number; total: number }>();
    run.forEach((q) => {
      const d = byDomain.get(q.domainId) ?? { correct: 0, total: 0 };
      d.total += 1;
      if (isOk(q, finalAnswers[q.id])) d.correct += 1;
      byDomain.set(q.domainId, d);
    });
    const at = new Date().toISOString();
    recordQuiz([...byDomain].map(([domainId, v]) => ({ topicId, domainId, ...v, at })));
    recordAnswers(run.map((q) => ({ id: q.id, ok: isOk(q, finalAnswers[q.id]) })));
    setDone(true);
  }

  function go(finalAnswers: Answers) {
    if (!run) return;
    setPicks([]);
    setRevealed(false);
    if (i + 1 < run.length) setI(i + 1);
    else finish(finalAnswers);
  }

  function submit(q: Question) {
    const next = { ...answers, [q.id]: picks };
    setAnswers(next);
    if (mode === "practice") setRevealed(true);
    else go(next);
  }

  // ---------- running ----------
  const q = run && !done ? run[i] : null;
  const scenario = q?.scenarioId ? SCENARIOS[q.scenarioId] : undefined;
  const need = q?.answer.length ?? 1;

  // ---------- results ----------
  const results = run && done ? run.map((x) => ({ q: x, picks: answers[x.id] ?? [], ok: isOk(x, answers[x.id]) })) : [];
  const correct = results.filter((r) => r.ok).length;
  const pct = results.length ? Math.round((correct / results.length) * 100) : 0;
  const domainRows = topic.domains
    .map((d) => {
      const rs = results.filter((r) => r.q.domainId === d.id);
      const c = rs.filter((r) => r.ok).length;
      return { d, total: rs.length, c, pct: rs.length ? Math.round((c / rs.length) * 100) : null };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));
  // Group misses by the official task statement (CCA-F) or skills-measured line (PL-300, GH-900).
  const relearn = Object.values(
    results
      .filter((r) => !r.ok)
      .reduce<Record<string, { key: string; q: Question; missed: number }>>((acc, r) => {
        const key = r.q.taskId ?? r.q.skill ?? r.q.id;
        acc[key] = { key, q: r.q, missed: (acc[key]?.missed ?? 0) + 1 };
        return acc;
      }, {}),
  ).sort((a, b) => b.missed - a.missed);

  return (
    <>
      <H1 sub="Scenario-based multiple choice, as in the real exam">Quiz</H1>

      {!run && (
        <Card>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1 block text-muted">Exam</span>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2"
              >
                {certTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">Questions</span>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2"
              >
                <option value={10}>10 (quick quiz)</option>
                <option value={20}>20</option>
                <option value={9999}>All {bank.length}</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">Mode</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2"
              >
                <option value="practice">Practice: answer shown after each question</option>
                <option value="exam">Exam: answers shown at the end</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Btn kind="primary" onClick={start} disabled={bank.length === 0}>Start</Btn>
            {bank.length > 0 && (
              <span className="text-sm text-muted">
                {bank.length} in the bank · {unseen} not seen yet · {toReview} to review. Unseen and missed questions come first.
              </span>
            )}
          </div>
        </Card>
      )}

      {!run && bank.length === 0 && (
        <Card className="mt-4">
          <p className="font-medium">No questions yet for this exam.</p>
          <p className="mt-1 text-sm text-muted">
            The bank is built once from the official exam guide, and every question must cite its source
            (Rules 5 and 8). The guide for this exam has not been loaded yet, so there is nothing to serve.
          </p>
        </Card>
      )}

      {q && run && (
        <>
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">Question {i + 1} of {run.length}</span>
              <span className="text-muted">
                {mode === "exam" ? "Exam mode" : "Practice"} · {topic.domains.find((d) => d.id === q.domainId)?.name}
              </span>
            </div>
            <Bar value={(i / run.length) * 100} />
          </div>

          {scenario && (
            <Card className="mb-3 bg-line/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Scenario: {scenario.title}</div>
              <p className="mt-1 text-sm">{scenario.text}</p>
            </Card>
          )}

          <Card>
            <p>{q.prompt}</p>
            <p className="mt-2 text-xs font-medium text-muted">
              {need === 1 ? "Select ONE answer." : `Select ${need} answers.`}
            </p>
            <div className="mt-3 space-y-2">
              {q.choices.map((c, idx) => {
                const on = picks.includes(idx);
                const right = q.answer.includes(idx);
                const style = !revealed
                  ? on ? "border-accent bg-accent/10" : "border-line hover:bg-line/40"
                  : right
                    ? "border-green-500 bg-green-500/10"
                    : on ? "border-red-500 bg-red-500/10" : "border-line opacity-60";
                return (
                  <button
                    key={idx}
                    disabled={revealed}
                    onClick={() => toggle(q, idx)}
                    className={`flex w-full gap-3 rounded-lg border p-3 text-left text-sm ${style}`}
                  >
                    <span className="font-semibold">{LETTER(idx)}.</span>
                    <span className="flex-1">{c}</span>
                    {revealed && right && <span className="text-green-600">✓ correct</span>}
                    {revealed && on && !right && <span className="text-red-600">✗ your answer</span>}
                  </button>
                );
              })}
            </div>

            {!revealed && (
              <div className="mt-4">
                <Btn kind="primary" disabled={picks.length !== need} onClick={() => submit(q)}>
                  {mode === "exam" ? (i + 1 === run.length ? "Finish exam" : "Next") : "Submit answer"}
                </Btn>
                {picks.length !== need && (
                  <span className="ml-3 text-xs text-muted">Pick {need === 1 ? "one" : need} to continue</span>
                )}
              </div>
            )}

            {revealed && (
              <div className="mt-4 text-sm">
                <p className={`font-medium ${isOk(q, picks) ? "text-green-600" : "text-red-600"}`}>
                  {isOk(q, picks) ? "Correct" : `Not quite. Right answer: ${q.answer.map(LETTER).join(" + ")}`}
                </p>
                <p className="mt-2">{q.explanation}</p>
                <p className="mt-2 text-xs text-muted">
                  Source: {q.source.label} ·{" "}
                  <a href={q.source.url} target="_blank" rel="noreferrer" className="text-accent underline">docs ↗</a>
                </p>
                <div className="mt-3">
                  <Btn kind="primary" onClick={() => go(answers)}>{i + 1 === run.length ? "See results" : "Next"}</Btn>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {run && done && (
        <div className="space-y-5">
          <Card>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-light">{correct} / {results.length}</span>
              <span className="text-xl font-medium">{pct}%</span>
            </div>
            <div className="mt-2"><Bar value={pct} className={barColor(pct)} /></div>
            <p className="mt-3 text-xs text-muted">
              The real exam passes on a scaled 720 of 1,000, not a fixed percent. Your go signal: 80%+ overall with no
              domain below 70% on both mocks. Saved to your progress.
            </p>
          </Card>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">By domain (weakest first)</h2>
            <div className="space-y-2">
              {domainRows.map(({ d, c, total, pct: p }) => (
                <Card key={d.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{d.name} <span className="text-muted">· {d.weight}% of exam</span></span>
                    <span className="font-medium">{c}/{total} · {p}%</span>
                  </div>
                  <div className="mt-2"><Bar value={p ?? 0} className={barColor(p ?? 0)} /></div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">What to relearn</h2>
            {relearn.length === 0 ? (
              <Card className="text-sm">Nothing missed. Run another set to cover unseen questions.</Card>
            ) : (
              <div className="space-y-2">
                {relearn.map(({ key, q: rq, missed }) => {
                  const task = rq.taskId ? TASK_BY_ID[rq.taskId] : undefined;
                  const sid = sessionFor(rq.taskId);
                  return (
                    <Card key={key}>
                      <div className="text-sm font-medium">
                        {task ? `Task ${rq.taskId}: ${task.title}` : rq.skill}
                      </div>
                      <div className="mt-1 text-xs text-muted">
                        Missed {missed} {missed === 1 ? "question" : "questions"}. Source: {rq.source.label}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        {sid && <Link href={`/modules/${sid}`} className="text-accent underline">Re-read in module {sid}</Link>}
                        <a href={rq.source.url} target="_blank" rel="noreferrer" className="text-accent underline">Official docs ↗</a>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Review every answer</h2>
            <div className="space-y-2">
              {results.map(({ q: rq, picks: p, ok }, n) => (
                <details key={rq.id} className="rounded-xl border border-line bg-surface p-3 shadow-sm">
                  <summary className="cursor-pointer text-sm">
                    <span className={ok ? "text-green-600" : "text-red-600"}>{ok ? "✓" : "✗"}</span>{" "}
                    {n + 1}. {rq.prompt}
                  </summary>
                  <ul className="mt-3 space-y-1 text-sm">
                    {rq.choices.map((c, idx) => (
                      <li key={idx} className={rq.answer.includes(idx) ? "font-medium text-green-600" : p.includes(idx) ? "text-red-600" : "text-muted"}>
                        {LETTER(idx)}. {c}
                        {rq.answer.includes(idx) && " ✓ correct"}
                        {p.includes(idx) && !rq.answer.includes(idx) && " ✗ your answer"}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">{rq.explanation}</p>
                  <p className="mt-2 text-xs text-muted">
                    Source: {rq.source.label} ·{" "}
                    <a href={rq.source.url} target="_blank" rel="noreferrer" className="text-accent underline">docs ↗</a>
                  </p>
                  {!ok && (
                    <div className="mt-2">
                      <Btn
                        disabled={stuckAdded.includes(rq.id)}
                        onClick={() => {
                          addStuck({ topicId, text: `Missed quiz question (${rq.taskId ? `task ${rq.taskId}` : rq.skill}): ${rq.prompt.slice(0, 120)}` });
                          setStuckAdded([...stuckAdded, rq.id]);
                        }}
                      >
                        {stuckAdded.includes(rq.id) ? "Added to stuck list" : "Add to stuck list"}
                      </Btn>
                    </div>
                  )}
                </details>
              ))}
            </div>
          </section>

          <div className="flex gap-2">
            <Btn kind="primary" onClick={start}>Another set</Btn>
            <Btn onClick={() => setRun(null)}>Back to setup</Btn>
          </div>
        </div>
      )}
    </>
  );
}
