"use client";
// Local-first store (browser localStorage). Everything goes through this module so it can be
// swapped for Supabase + Google sign-in later without touching the screens.
// NOTE: per CLAUDE.md the app database is the progress source of truth; this is the interim one.

import { useSyncExternalStore } from "react";
import { nextCatchUp, today } from "./dates";

export interface QuizAttempt {
  topicId: string;
  domainId: string;
  correct: number;
  total: number;
  at: string; // ISO timestamp
}

export interface SessionRecord {
  status: "done" | "missed";
  at: string;
  movedTo?: string; // reschedule target for missed sessions
}

export interface ExtraTopic {
  id: string;
  name: string;
  kind: "certification" | "hands-on";
  hours: number;
  examDate?: string;
}

export interface StuckItem {
  id: string;
  topicId: string;
  sessionId?: string; // where it came up, if from a session
  text: string; // what I didn't understand
  at: string; // ISO timestamp
  resolvedAt?: string;
}

export interface State {
  sessions: Record<string, SessionRecord>;
  quizzes: QuizAttempt[];
  labs: Record<string, boolean[]>;
  notes: Record<string, string>;
  extraTopics: ExtraTopic[];
  stuck: StuckItem[];
  filter: string; // topic switcher: "all" or a topic id
}

const KEY = "study-planner:v1";
const EMPTY: State = { sessions: {}, quizzes: [], labs: {}, notes: {}, extraTopics: [], stuck: [], filter: "all" };

let cache: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function snapshot(): State {
  if (cache === null) cache = load();
  return cache;
}

function commit(next: State) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep in memory */
  }
  listeners.forEach((l) => l());
}

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot,
    () => EMPTY,
  );
}

// --- actions ---

export function markDone(id: string) {
  const s = snapshot();
  commit({ ...s, sessions: { ...s.sessions, [id]: { status: "done", at: new Date().toISOString() } } });
}

/** "Didn't happen": auto-reschedule to the next Thu/Sat. No guilt prompts (Rule 6, 7). */
export function markMissed(id: string, plannedDate: string) {
  const s = snapshot();
  const from = plannedDate > today() ? plannedDate : today();
  commit({
    ...s,
    sessions: {
      ...s.sessions,
      [id]: { status: "missed", at: new Date().toISOString(), movedTo: nextCatchUp(from) },
    },
  });
}

export function undo(id: string) {
  const s = snapshot();
  const { [id]: _removed, ...rest } = s.sessions;
  void _removed;
  commit({ ...s, sessions: rest });
}

export function recordQuiz(attempts: QuizAttempt[]) {
  const s = snapshot();
  commit({ ...s, quizzes: [...s.quizzes, ...attempts] });
}

export function setLabItem(labId: string, index: number, value: boolean) {
  const s = snapshot();
  const cur = s.labs[labId] ?? [false, false, false, false, false];
  const next = cur.map((v, i) => (i === index ? value : v));
  commit({ ...s, labs: { ...s.labs, [labId]: next } });
}

export function setNote(sessionId: string, text: string) {
  const s = snapshot();
  commit({ ...s, notes: { ...s.notes, [sessionId]: text } });
}

export function addTopic(t: ExtraTopic) {
  const s = snapshot();
  commit({ ...s, extraTopics: [...s.extraTopics, t] });
}

export function removeTopic(id: string) {
  const s = snapshot();
  commit({ ...s, extraTopics: s.extraTopics.filter((t) => t.id !== id) });
}

export function addStuck(item: { topicId: string; sessionId?: string; text: string }) {
  const s = snapshot();
  const text = item.text.trim();
  if (!text) return;
  const entry: StuckItem = { id: `s-${Date.now()}`, ...item, text, at: new Date().toISOString() };
  commit({ ...s, stuck: [...s.stuck, entry] });
}

export function resolveStuck(id: string, resolved: boolean) {
  const s = snapshot();
  commit({
    ...s,
    stuck: s.stuck.map((x) =>
      x.id === id ? { ...x, resolvedAt: resolved ? new Date().toISOString() : undefined } : x,
    ),
  });
}

export function removeStuck(id: string) {
  const s = snapshot();
  commit({ ...s, stuck: s.stuck.filter((x) => x.id !== id) });
}

export function setFilter(filter: string) {
  commit({ ...snapshot(), filter });
}

export function exportJson(): string {
  return JSON.stringify(snapshot(), null, 2);
}

export function importJson(text: string) {
  commit({ ...EMPTY, ...JSON.parse(text) });
}

/** Effective date of a session: moved date if it was missed and rescheduled. */
export function effectiveDate(planned: string, rec?: SessionRecord): string {
  return rec?.status === "missed" && rec.movedTo ? rec.movedTo : planned;
}
