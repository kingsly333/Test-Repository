// Question bank. Rules:
//  5. Every question must cite its source (official exam guide or docs). No uncited questions.
//  8. Generate once, store here, re-serve. Never regenerate per use.
// CCA-F questions live in questions-ccaf.ts. PL-300 and GitHub Foundations stay empty until their
// official exam guides are loaded.

import { CCAF_QUESTIONS, CCAF_SCENARIOS } from "./questions-ccaf";
import { PL300_QUESTIONS } from "./questions-pl300";
import { GH900_QUESTIONS } from "./questions-gh900";

export interface Question {
  id: string;
  topicId: string;
  domainId: string;
  taskId?: string; // CCA-F task statement, e.g. "1.4" (drives the relearn list and module link)
  skill?: string; // PL-300 / GH-900: the official "skills measured" line this question tests
  scenarioId?: string; // exam-style scenario that frames the question
  prompt: string;
  choices: string[];
  answer: number[]; // indexes into choices; more than one = multiple-response ("select 2")
  explanation: string; // why the right answer is right and the others are not
  source: { label: string; url: string };
}

export interface Scenario {
  id: string;
  title: string;
  text: string;
}

export const QUESTIONS: Question[] = [...CCAF_QUESTIONS, ...PL300_QUESTIONS, ...GH900_QUESTIONS];
export const SCENARIOS: Record<string, Scenario> = { ...CCAF_SCENARIOS };

/** Defensive filter: an uncited question is dropped, never shown. */
export function citedQuestions(topicId: string): Question[] {
  return QUESTIONS.filter((q) => q.topicId === topicId && q.source?.url);
}
