"use client";

import { TOPICS } from "@/data/plan";
import { exportJson, importJson, useStore } from "@/lib/store";
import { readiness } from "@/lib/scoring";
import { useHydrated } from "@/lib/hydrated";
import { Bar, Btn, Card, H1, StatusPill } from "@/components/ui";
import { TopicTabs } from "@/components/TopicTabs";

const BAR_COLOR = { green: "bg-green-500", amber: "bg-amber-500", red: "bg-red-500" };

export default function Progress() {
  const hydrated = useHydrated();
  const state = useStore();
  if (!hydrated) return <div className="h-96" />;

  function download() {
    const url = URL.createObjectURL(new Blob([exportJson()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-planner-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function upload(f: File | undefined) {
    if (!f) return;
    try {
      importJson(await f.text());
    } catch {
      alert("That file is not a valid progress export.");
    }
  }

  const recent = [...state.quizzes].reverse().slice(0, 10);
  const doneCount = Object.values(state.sessions).filter((s) => s.status === "done").length;

  return (
    <>
      <H1 sub="Readiness, domain mastery and quiz history">Progress</H1>
      <TopicTabs />
      <p className="mb-4 text-sm text-muted">
        {doneCount} sessions done · {state.quizzes.length} quiz results saved
      </p>

      {state.filter !== "all" && !TOPICS.some((t) => t.id === state.filter && t.kind === "certification") && (
        <Card className="mb-4 text-sm text-muted">This topic has no exam. Its progress is the lab checklist on the Labs screen.</Card>
      )}
      <div className="space-y-4">
        {TOPICS.filter((t) => t.kind === "certification" && (state.filter === "all" || state.filter === t.id)).map((t) => {
          const r = readiness(t, state.quizzes);
          return (
            <Card key={t.id}>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">{t.name}</span>
                {r && <StatusPill status={r.status} />}
              </div>
              {!r && <p className="text-sm text-muted">Domains pending the official exam guide.</p>}
              {r && (
                <>
                  <div className="mb-4 text-3xl font-light">
                    {Math.round(r.score)}<span className="text-base text-muted"> / 100 readiness</span>
                  </div>
                  <div className="space-y-3">
                    {r.domains.map((d) => (
                      <div key={d.id}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span>{d.name} <span className="text-muted">({d.weight}%)</span></span>
                          <span className="text-muted">{d.mastery === null ? "not tested" : `${Math.round(d.mastery)}%`}</span>
                        </div>
                        <Bar
                          value={d.mastery ?? 0}
                          className={d.mastery === null ? "bg-line" : d.mastery >= 70 ? BAR_COLOR.green : d.mastery >= 55 ? BAR_COLOR.amber : BAR_COLOR.red}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    Weights are unverified until checked against the official guide.
                  </p>
                </>
              )}
            </Card>
          );
        })}
      </div>

      <h2 className="mb-2 mt-8 text-sm uppercase tracking-wide text-muted">Recent quiz results</h2>
      <div className="divide-y divide-line rounded-lg border border-line bg-surface">
        {recent.length === 0 && <div className="p-3 text-sm text-muted">No quizzes taken yet.</div>}
        {recent.map((q, i) => (
          <div key={i} className="flex justify-between p-3 text-sm">
            <span>{TOPICS.find((t) => t.id === q.topicId)?.name} · {q.domainId}</span>
            <span className="text-muted">
              {q.correct}/{q.total} · {Math.round((q.correct / q.total) * 100)}% · {q.at.slice(0, 10)}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-8 text-sm uppercase tracking-wide text-muted">Backup</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={download}>Export JSON</Btn>
        <label className="cursor-pointer rounded border border-line px-3 py-1.5 text-sm hover:bg-line/40">
          Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        <span className="text-xs text-muted">Progress lives in this browser until cloud sync is built.</span>
      </div>
    </>
  );
}
