"use client";

import { useState } from "react";
import { TOPICS } from "@/data/plan";
import { citedQuestions, type Question } from "@/data/questions";
import { recordQuiz } from "@/lib/store";
import { Btn, Card, H1 } from "@/components/ui";

export default function Quiz() {
  const certTopics = TOPICS.filter((t) => t.kind === "certification");
  const [topicId, setTopicId] = useState(certTopics[0].id);
  const [run, setRun] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<{ q: Question; ok: boolean }[]>([]);
  const [saved, setSaved] = useState(false);

  const bank = citedQuestions(topicId);

  function start() {
    setRun(bank.slice(0, 10));
    setI(0);
    setPicked(null);
    setResults([]);
    setSaved(false);
  }

  function next() {
    if (!run || picked === null) return;
    const done = [...results, { q: run[i], ok: picked === run[i].answer }];
    setResults(done);
    setPicked(null);
    if (i + 1 < run.length) setI(i + 1);
    else setI(run.length); // finished
  }

  function finish() {
    if (!run) return;
    const byDomain = new Map<string, { correct: number; total: number }>();
    results.forEach(({ q, ok }) => {
      const d = byDomain.get(q.domainId) ?? { correct: 0, total: 0 };
      d.total += 1;
      if (ok) d.correct += 1;
      byDomain.set(q.domainId, d);
    });
    recordQuiz(
      [...byDomain].map(([domainId, v]) => ({ topicId, domainId, ...v, at: new Date().toISOString() })),
    );
    setSaved(true);
  }

  const finished = run && i >= run.length;
  const q = run && !finished ? run[i] : null;

  return (
    <>
      <H1>Quiz</H1>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={topicId}
          onChange={(e) => { setTopicId(e.target.value); setRun(null); }}
          className="rounded border border-line bg-surface px-2 py-1.5 text-sm"
        >
          {certTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Btn kind="primary" onClick={start} disabled={bank.length === 0}>Start (up to 10)</Btn>
      </div>

      {bank.length === 0 && (
        <Card>
          <p className="font-medium">No questions yet for this topic.</p>
          <p className="mt-1 text-sm text-muted">
            The bank is built once from the official exam guide, and every question must cite its source
            (Rules 5 and 8). Until the guide is loaded there is nothing to serve, by design.
          </p>
        </Card>
      )}

      {q && (
        <Card>
          <div className="mb-2 text-xs text-muted">Question {i + 1} of {run!.length}</div>
          <p className="mb-3">{q.prompt}</p>
          <div className="space-y-2">
            {q.choices.map((c, idx) => {
              const reveal = picked !== null;
              const style = !reveal
                ? "border-line hover:bg-line/40"
                : idx === q.answer
                  ? "border-green-500 bg-green-500/10"
                  : idx === picked
                    ? "border-red-500 bg-red-500/10"
                    : "border-line opacity-60";
              return (
                <button
                  key={idx}
                  disabled={reveal}
                  onClick={() => setPicked(idx)}
                  className={`block w-full rounded border p-2 text-left text-sm ${style}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-3 text-sm">
              Source:{" "}
              <a href={q.source.url} target="_blank" rel="noreferrer" className="text-accent underline">
                {q.source.label}
              </a>
              <div className="mt-3"><Btn kind="primary" onClick={next}>Next</Btn></div>
            </div>
          )}
        </Card>
      )}

      {finished && (
        <Card>
          <p className="text-xl font-light">
            {results.filter((r) => r.ok).length} / {results.length} correct
          </p>
          <div className="mt-3">
            <Btn kind="primary" onClick={finish} disabled={saved}>{saved ? "Saved" : "Save score"}</Btn>
          </div>
        </Card>
      )}
    </>
  );
}
