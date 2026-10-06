# App Design (draft, 2026-10-06)

No app code until this is approved (CLAUDE.md Rule 1).

## Platform
One PWA (Next.js + Tailwind) on Vercel.
- Phone: install from the browser (Add to Home Screen). Full screen, own icon.
- Desktop: use in the browser or install from Chrome/Edge.
- One codebase, one login, data synced across devices.

## Security
| Layer | Choice |
|---|---|
| Sign-in | Google sign-in only (Google 2-step verification protects it) |
| Access | Allowlist with the owner's Google account only; everyone else rejected |
| Data | Supabase Postgres with row-level security |
| Session | Secure HTTP-only cookie, 30-day expiry |
| Secrets | Vercel environment variables only, never in git |

## UI reference
Based on Canvas LMS (screenshots in `UIUX/`, kept out of git). Borrow the layout, not the branding.

| Canvas pattern | In this app |
|---|---|
| Modules: collapsible module, numbered items, green left bar | Plan screen: topic = module, week = section, session = item (e.g. W3.2). Left bar: green done, grey pending, amber rescheduled |
| Content page: big light title, short text, bullets, image | Session page: goal, 3-5 key points, cited links to official docs, Done / Didn't happen buttons |
| Marks: table + weighting panel | Progress screen: quiz rows (score, date) + side panel of domain weight x mastery = readiness |
| Left icon rail + course menu | Desktop: left nav. Phone: bottom tabs |

Changes from Canvas:
1. App opens on Today (what to do now), not Home.
2. Neutral palette + one accent, light and dark mode. No third-party branding.
3. No Assignments tab. Labs replace it (5-point checklist).
4. Scores show % and a domain bar, not just "4.5/5".

### Desktop layout
```
┌──────┬──────────────┬──────────────────────────────────────────┐
│ [SP] │ Today        │ ▾ CCA-F · Week 3: Agentic architecture   │
│  ◉   │ Plan     ◀   │ ┃ ✓ W3.1 Orchestration patterns    Done  │
│  ▦   │ Quiz         │ ┃ ● W3.2 Subagents & handoffs   Wed 10pm │
│  ⧗   │ Labs         │ ┃ ○ W3.3 Antigravity lab        Fri 11am │
│  ?   │ Progress     │ ┃ ○ W3.4 Sunday quiz (review W1,W2)      │
│      │ Topics       │ ▸ CCA-F · Week 4: Tool design & MCP      │
└──────┴──────────────┴──────────────────────────────────────────┘
```

## Screens
| Screen | Purpose |
|---|---|
| Today | One card: what to do now. Done / Didn't happen. Missed sessions auto-move to the next catch-up slot |
| Plan | Week-by-week modules, review and exam dates marked |
| Quiz | One question at a time, source citation shown after each answer |
| Labs | Hands-on tasks with 5-point checklist |
| Progress | Readiness per topic, domain bars, mock history |
| Topics | Add / pause / archive topics, edit domains and weights |

## Topics are data
```
Topic
 ├─ type: certification | hands-on
 ├─ exam date (optional), pass mark
 ├─ domains + weights (from official guide)
 ├─ resources (links)
 └─ question bank (generated once, stored, re-served — Rule 8)
```
Adding a topic shows the timeline impact before confirming (e.g. "PL-300 moves Feb 20 -> Mar 20"). Choose: queue after current topics or run alongside.

## Pitfalls
1. Google OAuth apps in "Testing" mode lose Calendar access every 7 days. Publish the app (free); accept the one-time "unverified app" warning.
2. Question generation uses Claude API tokens: one-off per topic, set a spend cap.
3. Supabase free projects pause after 1 week idle: needs a keep-alive.
4. Phone push only works when the PWA is installed (iPhone: via Safari).

## Open decisions
- Offline quizzes (cheap to add)?
- Progress export (CSV) for backup.
- Cert expiry reminders (CCA-F valid 12 months).
- Notes box per session.
- Time zone fixed to IST.
- Merge with Quick Hits or keep separate.

## Accounts needed (free to start)
GitHub, Vercel, Supabase, Google Cloud project (Calendar API), Anthropic API key.
