import { PLAN_START, WEEKS } from "@/data/plan";
import { addDays } from "./dates";

export type SessionKind = "learn" | "lab" | "quiz" | "mock" | "exam";

export interface Session {
  id: string; // e.g. "W3.2"
  weekN: number;
  topicId: string;
  title: string;
  kind: SessionKind;
  date: string; // planned date
  slot: string;
  minutes: number;
  detail: string;
}

const EVENING = "10:00–11:00 pm";
const MIDDAY = "11:00 am–12:30 pm";

export const SESSIONS: Session[] = WEEKS.flatMap((w) => {
  const mon = addDays(PLAN_START, (w.n - 1) * 7);
  const base = { weekN: w.n, topicId: w.topicId };
  const out: Session[] = [
    {
      ...base, id: `W${w.n}.1`, kind: "learn", date: mon, slot: EVENING, minutes: 60,
      title: `Learn: ${w.title}`, detail: "45 min learn + 15 min quiz",
    },
    {
      ...base, id: `W${w.n}.2`, kind: "learn", date: addDays(mon, 2), slot: EVENING, minutes: 60,
      title: `Continue: ${w.title}`, detail: "45 min learn + 15 min quiz",
    },
    w.mockFri
      ? {
          ...base, id: `W${w.n}.3`, kind: "mock", date: addDays(mon, 4), slot: MIDDAY, minutes: 120,
          title: `Mock exam: ${w.title}`, detail: "Full mock under exam conditions, then review",
        }
      : {
          ...base, id: `W${w.n}.3`, kind: "lab", date: addDays(mon, 4), slot: MIDDAY, minutes: 90,
          title: w.lab ? w.lab.name : `Practice: ${w.title}`,
          detail: "75 min hands-on + 15 min quiz",
        },
    {
      ...base, id: `W${w.n}.4`, kind: "quiz", date: addDays(mon, 6), slot: "any time", minutes: 10,
      title: `Review quiz: ${w.title}`, detail: "10 min quiz only (Sunday stays light)",
    },
  ];
  if (w.exam) {
    out.push({
      ...base, id: `W${w.n}.5`, kind: "exam", date: w.exam, slot: "exam slot", minutes: 135,
      title: "EXAM DAY", detail: "Exam booking not yet checked. Date is a proposal.",
    });
  }
  return out;
});

export const SESSION_BY_ID = Object.fromEntries(SESSIONS.map((s) => [s.id, s]));
