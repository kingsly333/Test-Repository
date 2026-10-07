// Source of truth: docs/plan.md. Keep the two in sync.
// Domain weights marked `verified: false` come from third-party sources or memory
// and must be checked against the official exam guides before quizzes are built.

export const PLAN_START = "2026-10-05"; // Monday

export interface Domain {
  id: string;
  name: string;
  weight: number; // percent
  verified: boolean;
}

export interface Topic {
  id: string;
  name: string;
  kind: "certification" | "hands-on";
  color: string;
  short: string; // label for the topic switcher
  note?: string;
  cert?: string;
  examDate?: string;
  domains: Domain[];
}

export const TOPICS: Topic[] = [
  {
    id: "ccaf",
    color: "#2563eb",
    short: "CCA-F",
    name: "Claude (CCA-F)",
    kind: "certification",
    cert: "Claude Certified Architect – Foundations",
    examDate: "2026-11-28",
    domains: [
      { id: "agentic", name: "Agentic Architecture & Orchestration", weight: 27, verified: true },
      { id: "claude-code", name: "Claude Code Configuration & Workflows", weight: 20, verified: true },
      { id: "prompting", name: "Prompt Engineering & Structured Output", weight: 20, verified: true },
      { id: "tools-mcp", name: "Tool Design & MCP Integration", weight: 18, verified: true },
      { id: "context", name: "Context Management & Reliability", weight: 15, verified: true },
    ],
  },
  {
    id: "github",
    color: "#7c3aed",
    short: "Git + GitHub",
    name: "Git + GitHub",
    kind: "certification",
    cert: "GitHub Foundations",
    examDate: "2026-12-26",
    // Official GH-900 study guide, skills measured as of January 2026. Weights are midpoints of the
    // official ranges (they sum to 92.5, not 100); readiness() normalises by the total.
    domains: [
      { id: "basics", name: "Understand Git and GitHub basics", weight: 27.5, verified: true },
      { id: "repos", name: "Work with GitHub repositories", weight: 12.5, verified: true },
      { id: "collab", name: "Collaborate using GitHub", weight: 12.5, verified: true },
      { id: "modern", name: "Apply modern development practices", weight: 12.5, verified: true },
      { id: "projects", name: "Manage projects with GitHub", weight: 7.5, verified: true },
      { id: "security", name: "Understand privacy, security, and administration", weight: 12.5, verified: true },
      { id: "community", name: "Explore the GitHub community", weight: 7.5, verified: true },
    ],
  },
  {
    id: "pl300",
    color: "#d97706",
    short: "Power BI",
    name: "Power BI (PL-300)",
    kind: "certification",
    cert: "Microsoft PL-300",
    examDate: "2027-02-20",
    // Official PL-300 study guide, skills measured as of 2026-04-20: 25-30 / 25-30 / 25-30 / 15-20. Midpoints.
    domains: [
      { id: "prepare", name: "Prepare the data", weight: 27.5, verified: true },
      { id: "model", name: "Model the data", weight: 27.5, verified: true },
      { id: "visualize", name: "Visualize and analyze the data", weight: 27.5, verified: true },
      { id: "manage", name: "Manage and secure Power BI", weight: 17.5, verified: true },
    ],
  },
  { id: "antigravity", color: "#0d9488", short: "Antigravity", name: "Antigravity", kind: "hands-on", domains: [] },
  { id: "vscode-agents", color: "#db2777", short: "VS Code", name: "VS Code agent coding", kind: "hands-on", domains: [] },
  {
    id: "python",
    color: "#16a34a",
    short: "Python",
    name: "Python",
    kind: "hands-on",
    note: "Basics, ~50 hrs, from the official Python tutorial. No exam.",
    domains: [],
  },
];

export interface Week {
  n: number;
  topicId: string;
  title: string;
  lab?: { id: string; name: string };
  mockFri?: boolean; // Friday session is a mock exam
  exam?: string; // exam date (Saturday)
  retests: string[];
}

export const WEEKS: Week[] = [
  { n: 1, topicId: "ccaf", title: "Exam guide + Claude Code config", lab: { id: "vscode-agents", name: "VS Code agent lab: setup" }, retests: ["2026-10-18", "2026-11-01"] },
  { n: 2, topicId: "ccaf", title: "Diagnostic test + Agentic architecture pt 1", lab: { id: "antigravity", name: "Antigravity lab: setup" }, retests: ["2026-10-25", "2026-11-08"] },
  { n: 3, topicId: "ccaf", title: "Agentic architecture pt 2", lab: { id: "antigravity", name: "Antigravity lab" }, retests: ["2026-11-01", "2026-11-15"] },
  { n: 4, topicId: "ccaf", title: "Tool design + MCP", lab: { id: "vscode-agents", name: "VS Code agent lab: tools + MCP" }, retests: ["2026-11-08", "2026-11-22"] },
  { n: 5, topicId: "ccaf", title: "Prompt engineering + structured output", lab: { id: "vscode-agents", name: "VS Code agent lab" }, retests: ["2026-11-15", "2026-11-22"] },
  { n: 6, topicId: "ccaf", title: "Context management + reliability", lab: { id: "antigravity", name: "Antigravity lab: build a small project" }, retests: ["2026-11-22", "2026-11-25"] },
  { n: 7, topicId: "ccaf", title: "Mock exam 1 + fix weak domains", mockFri: true, retests: [] },
  { n: 8, topicId: "ccaf", title: "Mock exam 2 + light review", exam: "2026-11-28", retests: [] },

  { n: 9, topicId: "github", title: "Git basics, GitHub intro, repos", retests: ["2026-12-13", "2026-12-20"] },
  { n: 10, topicId: "github", title: "Collaboration: PRs, issues, branches", retests: ["2026-12-20", "2026-12-23"] },
  { n: 11, topicId: "github", title: "Projects, security, admin, community, Copilot + Mock 1", mockFri: true, retests: [] },
  { n: 12, topicId: "github", title: "Mock exam 2 + review", exam: "2026-12-26", retests: [] },

  { n: 13, topicId: "pl300", title: "Prepare data: Power Query, cleaning", retests: ["2027-01-10", "2027-01-24"] },
  { n: 14, topicId: "pl300", title: "Prepare data pt 2 + model: relationships, star schema", retests: ["2027-01-17", "2027-01-31"] },
  { n: 15, topicId: "pl300", title: "Model data: DAX", retests: ["2027-01-24", "2027-02-07"] },
  { n: 16, topicId: "pl300", title: "DAX pt 2 + performance", retests: ["2027-01-31", "2027-02-14"] },
  { n: 17, topicId: "pl300", title: "Visualize and analyze", retests: ["2027-02-07", "2027-02-14"] },
  { n: 18, topicId: "pl300", title: "Manage and secure: workspaces, RLS", retests: ["2027-02-14", "2027-02-17"] },
  { n: 19, topicId: "pl300", title: "Mock exam 1 + fix gaps", mockFri: true, retests: [] },
  { n: 20, topicId: "pl300", title: "Mock exam 2 + review", exam: "2027-02-20", retests: [] },
  { n: 21, topicId: "python", title: "Run Python + numbers, strings, lists", lab: { id: "python", name: "Python practice: Run Python + numbers, strings, lists" }, retests: [] },
  { n: 22, topicId: "python", title: "Control flow: if, for, range", lab: { id: "python", name: "Python practice: Control flow: if, for, range" }, retests: [] },
  { n: 23, topicId: "python", title: "Functions", lab: { id: "python", name: "Python practice: Functions" }, retests: [] },
  { n: 24, topicId: "python", title: "Data structures", lab: { id: "python", name: "Python practice: Data structures" }, retests: [] },
  { n: 25, topicId: "python", title: "Comprehensions + looping", lab: { id: "python", name: "Python practice: Comprehensions + looping" }, retests: [] },
  { n: 26, topicId: "python", title: "Modules and imports", lab: { id: "python", name: "Python practice: Modules and imports" }, retests: [] },
  { n: 27, topicId: "python", title: "Files and JSON", lab: { id: "python", name: "Python practice: Files and JSON" }, retests: [] },
  { n: 28, topicId: "python", title: "Errors and exceptions", lab: { id: "python", name: "Python practice: Errors and exceptions" }, retests: [] },
  { n: 29, topicId: "python", title: "Classes", lab: { id: "python", name: "Python practice: Classes" }, retests: [] },
  { n: 30, topicId: "python", title: "Standard library tour", lab: { id: "python", name: "Python practice: Standard library tour" }, retests: [] },
  { n: 31, topicId: "python", title: "Virtual environments + pip", lab: { id: "python", name: "Python practice: Virtual environments + pip" }, retests: [] },
  { n: 32, topicId: "python", title: "Mini project 1: CSV summary", lab: { id: "python", name: "Python practice: Mini project 1: CSV summary" }, retests: [] },
  { n: 33, topicId: "python", title: "Mini project 1: refactor + errors", lab: { id: "python", name: "Python practice: Mini project 1: refactor + errors" }, retests: [] },
  { n: 34, topicId: "python", title: "Mini project 2: class + tests", lab: { id: "python", name: "Python practice: Mini project 2: class + tests" }, retests: [] },
  { n: 35, topicId: "python", title: "Review + checkpoint", lab: { id: "python", name: "Python practice: Review + checkpoint" }, retests: [] },
];

export interface Lab {
  id: string;
  name: string;
  checklist: string[];
}

// Draft checklist (docs/app-design.md open decision). Pass = 4 of 5.
const DEFAULT_CHECKLIST = [
  "Set up and run the tool end to end",
  "Complete a guided task from official docs",
  "Build something small from scratch",
  "Hit a problem and fix it yourself",
  "Explain how it works in 3 lines",
];

export const LABS: Lab[] = [
  { id: "antigravity", name: "Antigravity", checklist: DEFAULT_CHECKLIST },
  { id: "vscode-agents", name: "VS Code agent coding", checklist: DEFAULT_CHECKLIST },
  { id: "python", name: "Python basics", checklist: DEFAULT_CHECKLIST },
];

export const HOURS_PER_WEEK = 3.5;
