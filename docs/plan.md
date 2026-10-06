# Study Plan (phases approved 2026-10-05; week schedule + scoring added 2026-10-06)

Start: Mon 2026-10-05. Capacity: 3-4 hrs/week. Tuesday off. Sunday light (optional 15 min, not counted).
Hour estimates are rough, not official. Re-baseline after the week-2 diagnostic test.

## Phases

| Phase | Weeks | Dates | Focus | Hours | Exam |
|---|---|---|---|---|---|
| 1 | W1-W8 | Oct 5 - Nov 29 | CCA-F + Antigravity + VS Code agent practice (as labs, overlaps CCA-F Claude Code domain) | ~28 (CCA-F ~19, tool labs ~7, mocks ~2) | CCA-F: Sat 2026-11-28 (proposed) |
| 2 | W9-W12 | Nov 30 - Dec 27 | GitHub Foundations (use this repo as the lab) | ~13 | ~Sat 2026-12-26 (proposed; holiday risk, may shift to Jan 2) |
| 3 | W13-W20 | Dec 28 - Feb 21 | PL-300 Power BI (TOW model as the lab; focus on DAX, security, gaps) | ~28 | ~Sat 2027-02-20 (proposed) |

Total: 20 weeks. Order = fixed deadline first (CCA-F), then the lightest cert, then the heaviest.

## Weekly rhythm (core 3.5 hrs)

| Day | Slot | Length | Type |
|---|---|---|---|
| Mon | 10:00-11:00 pm | 45 learn + 15 test | Learn, then quiz |
| Wed | 10:00-11:00 pm | 45 learn + 15 test | Learn, then quiz |
| Fri | 11:00 am-12:30 pm | 75 lab + 15 test | Hands-on lab, then quiz |
| Sun | any time | 10 min test | Quiz only (keeps Sunday light) |
| Thu | 10:00-11:30 pm | catch-up | Auto-reschedule target for missed sessions |
| Sat | 11:00 am-12:30 pm | overflow | Free overflow / second catch-up slot |
| Tue | none | | Exempt |

Core load: about 2h45 learn/lab + 55 min tests = ~3h40 per week.
CDR is NOT treated as a blocker in this plan (user instruction). Its hours are not scheduled here. The app should still read Google Calendar and warn on real clashes.

## Test cadence
- Week 2: diagnostic test (sets baseline, re-sizes hours).
- Every alternate day (Mon, Wed, Fri, Sun): short 10-15 min quiz, every question cites a source.
- Spaced re-tests of missed items.
- Last 2 weeks of each phase: full mock exam, finished at least 3 days before the real exam.

## Topics (5)
| # | Topic | Certification | Test type |
|---|---|---|---|
| 1 | Claude (CCA-F) | Claude Certified Architect – Foundations | Exam (60 Q, 120 min, $125) |
| 2 | Power BI | PL-300 | Exam (TOW model as lab) |
| 3 | Git + GitHub | GitHub Foundations | Exam (this repo as lab) |
| 4 | Antigravity | none | Hands-on labs |
| 5 | VS Code agent coding | none | Hands-on labs |

Topics are data in the app: more can be added later (see docs/app-design.md). Each new topic extends the timeline at fixed 3-4 hrs/week.

## Review rule
- Sunday quiz re-tests that week's topic.
- Spaced re-tests: each topic returns at +1 week and +3 weeks (dates below).
- Two mocks per cert: Mock 1 on Friday of the second-last week, Mock 2 by Wednesday of exam week.

Domain weights marked * are unverified (third-party or memory). Verify against official guides before building quizzes.

## Phase 1: CCA-F + Antigravity + VS Code (Oct 5 - Nov 29)
| Week | Dates | Topic (weight*) | Lab | Re-tests |
|---|---|---|---|---|
| W1 | Oct 5-11 | Exam guide + Claude Code config (20%) | - | Oct 18, Nov 1 |
| W2 | Oct 12-18 | Diagnostic test + Agentic architecture pt 1 (27%) | - | Oct 25, Nov 8 |
| W3 | Oct 19-25 | Agentic architecture pt 2 | Antigravity | Nov 1, Nov 15 |
| W4 | Oct 26-Nov 1 | Tool design + MCP (18%) | - | Nov 8, Nov 22 |
| W5 | Nov 2-8 | Prompt engineering + structured output (20%) | VS Code agent | Nov 15, Nov 22 |
| W6 | Nov 9-15 | Context management + reliability (15%) | - | Nov 22, Nov 25 |
| W7 | Nov 16-22 | Mock 1 (Fri Nov 20), fix weak domains | - | - |
| W8 | Nov 23-29 | Mock 2 by Wed Nov 25, light review | - | EXAM Sat Nov 28 |

## Phase 2: GitHub Foundations (Nov 30 - Dec 27)
| Week | Dates | Topic | Re-tests |
|---|---|---|---|
| W9 | Nov 30-Dec 6 | Git basics, GitHub intro, repos | Dec 13, Dec 20 |
| W10 | Dec 7-13 | Collaboration: PRs, issues, branches (largest domain*) | Dec 20, Dec 23 |
| W11 | Dec 14-20 | Projects, security, admin, community, Copilot. Mock 1 Fri Dec 18 | - |
| W12 | Dec 21-27 | Mock 2 by Wed Dec 23, review | EXAM Sat Dec 26 (or Jan 2) |

## Phase 3: PL-300 Power BI (Dec 28 - Feb 21)
| Week | Dates | Topic (weight*) | Re-tests |
|---|---|---|---|
| W13 | Dec 28-Jan 3 | Prepare data: Power Query, cleaning (25-30%) | Jan 10, Jan 24 |
| W14 | Jan 4-10 | Prepare data pt 2 + model: relationships, star schema | Jan 17, Jan 31 |
| W15 | Jan 11-17 | Model data: DAX (25-30%) | Jan 24, Feb 7 |
| W16 | Jan 18-24 | DAX pt 2 + performance | Jan 31, Feb 14 |
| W17 | Jan 25-31 | Visualize and analyze (25-30%) | Feb 7, Feb 14 |
| W18 | Feb 1-7 | Manage and secure: workspaces, RLS (15-20%) | Feb 14, Feb 17 |
| W19 | Feb 8-14 | Mock 1 (Fri Feb 12), fix gaps | - |
| W20 | Feb 15-21 | Mock 2 by Wed Feb 17 | EXAM Sat Feb 20 |

## Scoring system
1. Quiz score: % correct. Every question tagged to a domain.
2. Domain mastery: average of last 3 attempts on that domain, latest counts double.
3. Exam readiness (0-100): sum of domain weight x domain mastery.
4. Labs: 5-point checklist per lab, pass = 4/5.
5. Sessions: "done" / "didn't happen". Drives rescheduling only, no score.

| Readiness | Status | Action |
|---|---|---|
| 80+ and no domain < 70 | Green: ready | Book / keep exam date |
| 65-79 | Amber: close | Next sessions target weakest domain |
| < 65 | Red: not yet | Consider moving exam |

Exam-go rule: green on both mocks. If not green by Wednesday of exam week, move the exam.

## Known risks
- W1 slipped: no session Mon Oct 5, Tue off. First session Wed Oct 7, Thu catch-up.
- Diwali (~Nov 8) in W5: treat as light week or add a buffer before CCA-F.
- Christmas / New Year over W12-W13: GitHub exam safer on Sat Jan 2.
- Fees and pass marks for PL-300 and GitHub Foundations unverified. Nothing booked.
- Study resources per topic not chosen yet (Anthropic Skilljar, Microsoft Learn, GitHub Learn).
