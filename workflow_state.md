# Workflow State

## Current Task
Phase 1 research: get official exam guides (CCA-F PDF, PL-300, GitHub Foundations), verify domain weights, pick study resources. Phase 3 (cited question bank) is blocked on that. App v0 (local-first) exists on branch feature/app-scaffold; cloud login/sync still to build.

## Next Step
Phase 1: download the official CCA-F exam guide PDF into docs/sources/ (git-ignored), verify the domain weights, and fill them into src/data/plan.ts. Then repeat for PL-300 and GitHub Foundations.

## Last Session
2026-10-07 (later): Built stuck list on branch feature/stuck-list: "Didn't get it" button on Today cards and module pages, /stuck page (add, clear, delete, export markdown, NotebookLM and Claude Code prompts). Stored in localStorage `stuck`. Lint, tsc, build pass; routes 200. Not done: re-serving stuck-topic questions in quizzes (question bank is empty). Not merged to main yet. Netlify hosting requested; user to run CLI steps (CLAUDE.md still says Vercel).

2026-10-07: Committed pending work on feature/app-scaffold (module detail page src/app/modules/[id], docs/sources/ git-ignored). Logged SHAs; added this Next Step section.

Earlier:
2026-10-06 (later): User feedback: next-day sessions not visible, UI poor, topic switcher missing (VS Code, Antigravity, Power BI, Python, Git + GitHub). Fixed on feature/app-scaffold: day picker (week strip + Today/Tomorrow), topic switcher chips on Today/Plan/Progress, Topics cards per topic, coloured session cards, restyled shell. Tool labs now on 6 Phase 1 Fridays (3 VS Code, 3 Antigravity). Python added as unscheduled topic. Verified with headless Chrome screenshots (desktop + phone width).

Earlier same day: 2026-10-06: Merged docs/plan-and-design into main (5e9fa22). Built app v0 on feature/app-scaffold: Next.js 16 + Tailwind 4 PWA with Today, Plan, Quiz, Labs, Progress, Topics screens, scoring, Thu/Sat auto-reschedule, add-topic with timeline impact, JSON export/import. Progress stored in browser localStorage via src/lib/store.ts (swap point for Supabase). Quiz bank is empty by design (Rule 5). Lint, tsc and build pass; all routes 200. Visual check done on desktop Today only (screenshot tool blocked by an extension).

## Task Log
| Date | Item | Commit |
|---|---|---|
| 2026-10-05 | Repo initialised (main) | — |
| 2026-10-05 | Baseline commit (.gitignore, CLAUDE.md, workflow_state.md) | b1ff3f7 |
| 2026-10-05 | Phased plan (docs/plan.md), CCA-F moved to Sat 2026-11-28, rules updated | 60bb21b |
| 2026-10-06 | Week schedule, scoring, app design; UIUX/ ignored (branch docs/plan-and-design) | 66bb7fd |
| 2026-10-06 | Merge docs/plan-and-design into main | 5e9fa22 |
| 2026-10-06 | App v0 scaffold + 6 screens (branch feature/app-scaffold) | 937183c |
| 2026-10-06 | Day picker, topic switcher, UI refresh | 9d391a7 |
| 2026-10-07 | Module detail page, ignore docs/sources/ | e5b5507 |
| 2026-10-07 | Stuck list feature (branch feature/stuck-list) | ea72fb5 |
| 2026-10-07 | Per-item Ask Claude + NotebookLM links on stuck list | e6a9282 |

## Phase Checkpoints
- [x] Phase 0: Bootstrap (git, .gitignore, CLAUDE.md, workflow_state.md, baseline commit b1ff3f7)
- [ ] Phase 1: Research exam guides, define syllabus per topic
- [x] Phase 2: Plan approved (docs/plan.md, merged 5e9fa22)
- [ ] Phase 3: Question bank (cited, generated once)
- [~] Phase 4: App scaffold done (v0, local storage). Remaining: Google sign-in + Supabase, service worker/offline, phone-width visual check
- [ ] Phase 5: Google Calendar sync + progress store
- [ ] Phase 6: "What next" nudges (calendar + Gmail digest, push if PWA installed)
- [ ] Phase 7: Deploy to Vercel

## Decisions
- 2026-10-06: Python added as a topic (user expected it). Not scheduled: needs goal + hours. Default would queue after PL-300.
- 2026-10-06: Tool labs expanded to 6 Phase 1 Fridays to make VS Code and Antigravity real tracks (fits the ~7h in the plan).
- 2026-10-05: Topics = CCA-F, Power BI, Git + GitHub, Antigravity, VS Code agent vibe coding.
- 2026-10-05: Certifications wherever applicable (PL-300, GitHub Foundations likely; verify).
- 2026-10-05: Form = PWA on Vercel. Sync = Google Calendar events.
- 2026-10-05: Repo at `D:\study-planner` (home dir `C:\Users\Dell` deliberately not used).
- 2026-10-05: CCA-F exam = Sun 2026-11-15. Plan runs Mon 2026-10-05 to Sun 2026-11-15 (exactly 6 weeks).
- 2026-10-05: Capacity = 3-4 hrs/week (18-24 hrs over 6 weeks). User wants all 3 certs + 2 hands-on topics; feasibility vs 6 weeks under review.
- 2026-10-05: 6 weeks judged too short for all 5 topics at 3-4 hrs/week. User chose to move the CCA-F date and phase the work. Draft in docs/plan.md: Phase 1 CCA-F + Antigravity + VS Code (W1-8, exam Sat 2026-11-28), Phase 2 GitHub Foundations (W9-12), Phase 3 PL-300 (W13-20). Exam dates are proposals.
- 2026-10-05: Availability: evenings 10-11:30 pm or days 11 am-2:30 pm, Sundays minimal, Tuesday off. Saturday 9-1:30 is CDR.
- 2026-10-05: User approved phases and Sat 2026-11-28 CCA-F date (exam booking not yet checked). Tests changed to short 10-15 min quizzes on alternate days (Mon/Wed/Fri/Sun). CDR block ignored as a blocker for planning; existing calendar events left untouched.
- 2026-10-05: No remote added. Ask before adding one.
- 2026-10-06: CCA-F partner-eligibility requirement noted; user said ignore it for planning.
- 2026-10-06: Scoring = domain mastery (last 3, latest x2) -> readiness = sum(weight x mastery). Green 80+ (no domain <70), amber 65-79, red <65. Exam-go = green on both mocks.
- 2026-10-06: UI modelled on Canvas LMS layout (no branding). Login = Google sign-in + single-account allowlist, Supabase RLS.
- 2026-10-06: Topics stored as data so more can be added; app shows timeline impact before adding.
- 2026-10-06: UIUX/ excluded from git (screenshots contain name + bookmarks).
- 2026-10-06: User approved design and told me to merge and build. Built local-first first because Supabase/Google OAuth need accounts only the user can create.
- 2026-10-06: Next 16 ships AGENTS.md: read node_modules/next/dist/docs before writing Next code (APIs differ from older versions).
- 2026-10-06: Plan data lives in src/data/plan.ts and must stay in sync with docs/plan.md. GitHub Foundations domains left empty until official guide is read (not invented).
