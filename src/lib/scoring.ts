import type { Topic } from "@/data/plan";
import type { QuizAttempt } from "./store";

export type Status = "green" | "amber" | "red";

/** Mastery % for one domain: last 3 attempts, the latest counts double. null = never tested. */
export function mastery(attempts: QuizAttempt[]): number | null {
  const last = attempts.slice(-3).filter((a) => a.total > 0);
  if (last.length === 0) return null;
  let sum = 0;
  let w = 0;
  last.forEach((a, i) => {
    const weight = i === last.length - 1 ? 2 : 1;
    sum += (a.correct / a.total) * 100 * weight;
    w += weight;
  });
  return sum / w;
}

export interface DomainScore {
  id: string;
  name: string;
  weight: number;
  mastery: number | null;
}

export interface Readiness {
  score: number; // 0-100
  status: Status;
  domains: DomainScore[];
}

/** Readiness = sum(weight x mastery). Untested domains count as 0. null if the topic has no domains. */
export function readiness(topic: Topic, quizzes: QuizAttempt[]): Readiness | null {
  if (topic.domains.length === 0) return null;
  const total = topic.domains.reduce((s, d) => s + d.weight, 0);
  const domains: DomainScore[] = topic.domains.map((d) => ({
    id: d.id,
    name: d.name,
    weight: d.weight,
    mastery: mastery(quizzes.filter((q) => q.topicId === topic.id && q.domainId === d.id)),
  }));
  const score = domains.reduce((s, d) => s + (d.weight / total) * (d.mastery ?? 0), 0);
  const minDomain = Math.min(...domains.map((d) => d.mastery ?? 0));
  const status: Status =
    score >= 80 && minDomain >= 70 ? "green" : score >= 65 ? "amber" : "red";
  return { score, status, domains };
}

export const STATUS_LABEL: Record<Status, string> = {
  green: "Ready",
  amber: "Close",
  red: "Not yet",
};

export const LAB_PASS = 4; // of 5
