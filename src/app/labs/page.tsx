"use client";

import { LABS } from "@/data/plan";
import { setLabItem, useStore } from "@/lib/store";
import { LAB_PASS } from "@/lib/scoring";
import { useHydrated } from "@/lib/hydrated";
import { Card, H1 } from "@/components/ui";

export default function Labs() {
  const hydrated = useHydrated();
  const state = useStore();
  if (!hydrated) return <H1>Labs</H1>;

  return (
    <>
      <H1>Labs</H1>
      <p className="mb-4 text-sm text-muted">
        Hands-on topics have no exam. Tick 4 of 5 to pass. Checklist wording is a draft you can change in
        src/data/plan.ts.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {LABS.map((lab) => {
          const ticks = state.labs[lab.id] ?? [false, false, false, false, false];
          const n = ticks.filter(Boolean).length;
          return (
            <Card key={lab.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{lab.name}</span>
                <span className={`text-sm ${n >= LAB_PASS ? "text-green-500" : "text-muted"}`}>
                  {n}/5 {n >= LAB_PASS && "· passed"}
                </span>
              </div>
              {lab.checklist.map((item, i) => (
                <label key={i} className="flex items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={ticks[i]}
                    onChange={(e) => setLabItem(lab.id, i, e.target.checked)}
                  />
                  {item}
                </label>
              ))}
            </Card>
          );
        })}
      </div>
    </>
  );
}
