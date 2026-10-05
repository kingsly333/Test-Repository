# Study Planner — Project Rules

## Goal
6-week study plan with testing for: CCA-F, Power BI (PL-300), Git + GitHub (GitHub Foundations), Antigravity, VS Code agent-style vibe coding.
App: PWA (Next.js + Tailwind, deployed on Vercel) that syncs study/test slots to Google Calendar, stores progress, and tells the user what to do next.
Certifications wherever one exists. Tool-only topics (Antigravity, VS Code agents) get hands-on tests.

## User
Kingsly Jayanthan, Chief of Staff, Nimida Group (Bangalore). Beginner-friendly steps, exact copy-paste commands, concise replies, flag token costs and pitfalls.

## Rules
1. Research first. No app code until the plan is approved.
2. Read `workflow_state.md` at session start; update it at session end.
3. Never commit secrets, `.env`, data files, `cache.abf` or `localSettings.json`. Check `git status` before every commit.
4. Never add a git remote or push without asking first.
5. Every test question must cite its source (official exam guide or docs). No uncited questions.
6. Tuesdays are never scheduled. Missed sessions auto-reschedule, no guilt prompts.
7. Reporting is casual: "done" or "didn't happen".
8. Generate question banks once, store them, re-serve them. Do not regenerate per use (token cost).
9. Scoped build: text-first UI, no perfectionism.

## Conventions
- Small commits, imperative messages.
- Branch `main` is the baseline; work on feature branches.
- Plan source of truth: `docs/plan.md` (to be created). Progress source of truth: the app database, not markdown.

## Dates
- Plan start: Mon 2026-10-05. Full phased plan: `docs/plan.md` (draft, 20 weeks).
- CCA-F exam: moved from Sun 2026-11-15 to Sat 2026-11-28 (proposed, user to confirm). Last mock done by Wed 2026-11-25.
- Sundays light (10 min quiz only), Tuesdays off. Free windows: 10-11:30 pm or 11 am-2:30 pm.
- CDR block is not treated as a blocker for this plan (user instruction). Never delete or edit existing Google Calendar events without asking.
- Tests: short 10-15 min quizzes on alternate days (Mon, Wed, Fri, Sun).

## Open questions
- Capacity: 3-4 hrs/week (given 2026-10-05). Whether 6 weeks is enough for all topics: see workflow_state.md Decisions.
- Exam dates for PL-300 and GitHub Foundations (not yet given; only CCA-F is fixed).
- Merge with Quick Hits app or keep separate.
