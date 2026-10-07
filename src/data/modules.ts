// Study modules. Source of truth for CCA-F: "Claude Certified Architect – Foundations Exam Guide"
// v1.0 (effective July 2026), section 6 "Detailed Objectives by Domain". Task statements are paraphrased
// in our own words; every point cites its task statement (Rule 5). The PDF is kept locally in
// docs/sources/ (git-ignored). Link targets were checked (HTTP 200) on 2026-10-06.

export interface Resource { label: string; url: string }

export const GUIDE: Resource = {
  label: "CCA-F Exam Guide (official PDF)",
  url: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification",
};

export const R: Record<string, Resource> = {
  memory: { label: "Claude Code: memory and CLAUDE.md", url: "https://code.claude.com/docs/en/memory" },
  commands: { label: "Claude Code: slash commands", url: "https://code.claude.com/docs/en/slash-commands" },
  skills: { label: "Claude Code: skills", url: "https://code.claude.com/docs/en/skills" },
  subagents: { label: "Claude Code: subagents", url: "https://code.claude.com/docs/en/sub-agents" },
  hooks: { label: "Claude Code: hooks", url: "https://code.claude.com/docs/en/hooks" },
  mcp: { label: "Claude Code: MCP", url: "https://code.claude.com/docs/en/mcp" },
  ci: { label: "Claude Code: GitHub Actions (CI)", url: "https://code.claude.com/docs/en/github-actions" },
  cli: { label: "Claude Code: CLI reference", url: "https://code.claude.com/docs/en/cli-reference" },
  workflows: { label: "Claude Code: common workflows", url: "https://code.claude.com/docs/en/common-workflows" },
  sdk: { label: "Claude Agent SDK overview", url: "https://code.claude.com/docs/en/agent-sdk/overview" },
  tooluse: { label: "Tool use overview", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
  batch: { label: "Message Batches API", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
  prompting: { label: "Prompt engineering overview", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
  examples: { label: "Prompting best practices: use examples", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#use-examples-effectively" },
  context: { label: "Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
  mcpintro: { label: "Model Context Protocol: intro", url: "https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro" },
};

export interface TaskStatement {
  id: string; // "3.1"
  domainId: string; // matches Topic.domains[].id in plan.ts
  title: string;
  points: string[];
  refs: (keyof typeof R)[];
}

export const CCAF_TASKS: TaskStatement[] = [
  // ---- Domain 3: Claude Code Configuration & Workflows (20%) ----
  { id: "3.1", domainId: "claude-code", title: "Configure CLAUDE.md with hierarchy, scoping and modular organization",
    points: [
      "Three levels: user (~/.claude/CLAUDE.md), project (root or .claude/CLAUDE.md), directory (subfolder CLAUDE.md).",
      "User-level instructions are personal: they are not shared with teammates through version control.",
      "@import keeps CLAUDE.md modular; .claude/rules/ splits topic rules (testing, api, deployment) into files.",
      "Use /memory to see which memory files loaded when behaviour differs between sessions.",
    ], refs: ["memory"] },
  { id: "3.2", domainId: "claude-code", title: "Create custom slash commands and skills",
    points: [
      "Project commands live in .claude/commands/ (shared via git); personal ones in ~/.claude/commands/.",
      "Skills live in .claude/skills/ with a SKILL.md; frontmatter supports context: fork, allowed-tools, argument-hint.",
      "context: fork runs a skill in an isolated sub-agent so verbose output does not pollute the main chat.",
      "Skills = on-demand task workflows; CLAUDE.md = always-loaded universal standards.",
    ], refs: ["commands", "skills"] },
  { id: "3.3", domainId: "claude-code", title: "Apply path-specific rules for conditional convention loading",
    points: [
      ".claude/rules/ files can carry YAML frontmatter paths: with glob patterns (e.g. **/*.test.tsx).",
      "Path-scoped rules load only when editing matching files, which saves context and tokens.",
      "Prefer glob rules over subdirectory CLAUDE.md when a convention spans many directories (tests beside code).",
    ], refs: ["memory"] },
  { id: "3.4", domainId: "claude-code", title: "Decide between plan mode and direct execution",
    points: [
      "Plan mode: large changes, several valid approaches, architectural decisions, many files.",
      "Direct execution: simple, well-scoped changes (one validation check, a clear single-file bug).",
      "Explore subagent isolates verbose discovery and returns a summary, preserving main context.",
      "Combine them: plan to investigate, then execute the agreed plan.",
    ], refs: ["workflows", "subagents"] },
  { id: "3.5", domainId: "claude-code", title: "Apply iterative refinement techniques",
    points: [
      "2-3 concrete input/output examples beat prose when descriptions are interpreted inconsistently.",
      "Test-driven iteration: write tests first, then feed failures back.",
      "Interview pattern: have Claude ask questions to surface considerations you missed.",
      "Interacting problems go in one message; independent problems can be fixed one at a time.",
    ], refs: ["workflows"] },
  { id: "3.6", domainId: "claude-code", title: "Integrate Claude Code into CI/CD pipelines",
    points: [
      "-p / --print runs non-interactively so pipelines do not hang waiting for input.",
      "--output-format json with --json-schema gives machine-parseable findings (e.g. inline PR comments).",
      "CLAUDE.md supplies project context (testing standards, fixtures, review criteria) to CI runs.",
      "A fresh independent session reviews better than the session that wrote the code; pass prior findings on re-runs to avoid duplicate comments.",
    ], refs: ["ci", "cli"] },

  // ---- Domain 1: Agentic Architecture & Orchestration (27%) ----
  { id: "1.1", domainId: "agentic", title: "Design and implement agentic loops",
    points: [
      "Loop: send request, inspect stop_reason, run requested tools, append results, repeat.",
      'Continue on stop_reason "tool_use"; stop on "end_turn".',
      "Tool results are appended to history so the model reasons about its next action.",
      "Anti-patterns: parsing natural language to end the loop, iteration caps as the main stop, checking for text as completion.",
    ], refs: ["sdk", "tooluse"] },
  { id: "1.2", domainId: "agentic", title: "Orchestrate multi-agent systems (coordinator-subagent)",
    points: [
      "Hub-and-spoke: the coordinator handles routing, error handling and communication between subagents.",
      "Subagents have isolated context; they do not inherit the coordinator's history.",
      "Coordinator decomposes, delegates, aggregates, and picks subagents by query complexity (not always the full pipeline).",
      "Too-narrow decomposition causes incomplete coverage; use iterative refinement to close gaps.",
    ], refs: ["sdk", "subagents"] },
  { id: "1.3", domainId: "agentic", title: "Configure subagent invocation, context passing and spawning",
    points: [
      'The Task tool spawns subagents; the coordinator\'s allowedTools must include "Task".',
      "Pass full findings in the subagent prompt: no automatic context inheritance or shared memory.",
      "Separate content from metadata (source URL, document, page) to keep attribution.",
      "Parallel subagents: emit several Task calls in one coordinator response.",
    ], refs: ["sdk", "subagents"] },
  { id: "1.4", domainId: "agentic", title: "Implement multi-step workflows with enforcement and handoff",
    points: [
      "Programmatic enforcement (hooks, prerequisite gates) vs prompt guidance: prompts alone have a non-zero failure rate.",
      "Use gates when compliance must be deterministic (e.g. block process_refund until get_customer returns a verified ID).",
      "Escalation handoffs carry customer details, root cause and recommended action for humans without the transcript.",
    ], refs: ["hooks", "sdk"] },
  { id: "1.5", domainId: "agentic", title: "Apply Agent SDK hooks for interception and normalization",
    points: [
      "PostToolUse hooks transform tool results (timestamps, status codes) before the model sees them.",
      "Outgoing-call hooks enforce rules (e.g. block refunds over a threshold and redirect to human escalation).",
      "Hooks give deterministic guarantees; prompts give probabilistic compliance.",
    ], refs: ["hooks", "sdk"] },
  { id: "1.6", domainId: "agentic", title: "Design task decomposition strategies",
    points: [
      "Prompt chaining (fixed sequence) for predictable multi-aspect work; dynamic decomposition for open-ended investigation.",
      "Large reviews: per-file local passes plus a separate cross-file integration pass to avoid attention dilution.",
      "Open-ended tasks: map structure, find high-impact areas, build a prioritised plan that adapts as you learn.",
    ], refs: ["workflows"] },
  { id: "1.7", domainId: "agentic", title: "Manage session state, resumption and forking",
    points: [
      "--resume <session-name> continues a specific earlier conversation.",
      "fork_session branches from a shared baseline to compare approaches.",
      "After code changes, tell a resumed session which files changed.",
      "If prior tool results are stale, start fresh with a structured summary instead of resuming.",
    ], refs: ["cli", "sdk"] },

  // ---- Domain 2: Tool Design & MCP Integration (18%) ----
  { id: "2.1", domainId: "tools-mcp", title: "Design tool interfaces with clear descriptions and boundaries",
    points: [
      "Tool descriptions are the main signal for tool selection; minimal descriptions give unreliable choices.",
      "Include input formats, example queries, edge cases and when-to-use-versus-similar-tool boundaries.",
      "Overlapping tools cause misrouting: rename, split generic tools into purpose-specific ones with clear contracts.",
      "Check system prompt wording: keyword-sensitive instructions can override good descriptions.",
    ], refs: ["tooluse"] },
  { id: "2.2", domainId: "tools-mcp", title: "Implement structured error responses for MCP tools",
    points: [
      "Use the MCP isError flag to report failures to the agent.",
      "Error types: transient, validation, business-rule, permission. Return errorCategory and isRetryable, not generic \"Operation failed\".",
      "Business-rule violations: retriable false plus a customer-friendly explanation.",
      "Access failure (needs a retry decision) is different from a valid empty result.",
    ], refs: ["mcpintro", "mcp"] },
  { id: "2.3", domainId: "tools-mcp", title: "Distribute tools across agents and configure tool choice",
    points: [
      "Too many tools (e.g. 18 vs 4-5) degrades selection; give each agent only its role's tools.",
      "Agents misuse tools outside their specialty (a synthesis agent web-searching).",
      'tool_choice: "auto" (may answer in text), "any" (must call some tool), forced {"type":"tool","name":...} (must call that tool).',
      "Force a tool to run first (e.g. extract_metadata) and handle later steps in follow-up turns.",
    ], refs: ["tooluse"] },
  { id: "2.4", domainId: "tools-mcp", title: "Integrate MCP servers into Claude Code and agent workflows",
    points: [
      "Project scope: .mcp.json (shared). User scope: ~/.claude.json (personal/experimental).",
      "Expand env vars like ${GITHUB_TOKEN} in .mcp.json so secrets are never committed.",
      "Tools from all configured servers are discovered at connect time and available together.",
      "MCP resources expose catalogs (schemas, issue summaries) to cut exploratory calls; prefer community servers for standard integrations.",
    ], refs: ["mcp", "mcpintro"] },
  { id: "2.5", domainId: "tools-mcp", title: "Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob)",
    points: [
      "Grep searches file contents; Glob matches file paths; Read/Write do whole files; Edit does targeted unique-text changes.",
      "If Edit fails on non-unique text, fall back to Read then Write.",
      "Build understanding incrementally: Grep for entry points, then Read to follow imports, not read everything upfront.",
    ], refs: ["workflows"] },

  // ---- Domain 4: Prompt Engineering & Structured Output (20%) ----
  { id: "4.1", domainId: "prompting", title: "Design prompts with explicit criteria to reduce false positives",
    points: [
      "Explicit categorical criteria beat vague instructions (\"be conservative\", \"only high-confidence\").",
      "False positives destroy trust in the accurate categories too.",
      "State which issues to report (bugs, security) and which to skip; give severity criteria with code examples.",
      "Temporarily disable a noisy category while you fix its prompt.",
    ], refs: ["prompting"] },
  { id: "4.2", domainId: "prompting", title: "Apply few-shot prompting for consistency and quality",
    points: [
      "Few-shot examples are the strongest fix when instructions alone give inconsistent output.",
      "Use 2-4 targeted examples for ambiguous cases, showing why one action beat the alternatives.",
      "Show the exact output format (location, issue, severity, fix).",
      "Examples help generalisation and reduce hallucination in extraction over varied document structures.",
    ], refs: ["examples", "prompting"] },
  { id: "4.3", domainId: "prompting", title: "Enforce structured output with tool use and JSON schemas",
    points: [
      "tool_use with a JSON schema is the most reliable route to schema-valid output (no syntax errors).",
      "It does not stop semantic errors (totals that do not add up, values in wrong fields).",
      "Make fields optional/nullable when the source may lack them, so the model does not fabricate.",
      'Add enum values like "unclear" and "other" + detail string for extensible categories; add normalization rules in the prompt.',
    ], refs: ["tooluse"] },
  { id: "4.4", domainId: "prompting", title: "Implement validation, retry and feedback loops for extraction",
    points: [
      "Retry with the document, the failed extraction and the specific validation error appended.",
      "Retries work for format/structure errors; they fail when the information is absent from the source.",
      "Add calculated_total next to stated_total and a conflict_detected flag for self-checks.",
      "A detected_pattern field lets you analyse which constructs trigger dismissed findings.",
    ], refs: ["tooluse", "prompting"] },
  { id: "4.5", domainId: "prompting", title: "Design efficient batch processing strategies",
    points: [
      "Message Batches API: 50% cheaper, up to 24 hours, no latency guarantee.",
      "Good for overnight/weekly work; wrong for blocking checks such as pre-merge.",
      "No multi-turn tool calling inside one batch request; use custom_id to match results.",
      "Resubmit only failed items (by custom_id), e.g. chunk oversize docs; refine prompts on a sample first.",
    ], refs: ["batch"] },
  { id: "4.6", domainId: "prompting", title: "Design multi-instance and multi-pass review architectures",
    points: [
      "A model reviewing its own output in the same session keeps its reasoning bias and misses issues.",
      "Independent review instances (no prior reasoning) catch more than self-review or extended thinking.",
      "Split big reviews into per-file passes plus a cross-file integration pass.",
      "Have the model self-report confidence per finding to route review.",
    ], refs: ["prompting", "ci"] },

  // ---- Domain 5: Context Management & Reliability (15%) ----
  { id: "5.1", domainId: "context", title: "Manage conversation context to preserve critical information",
    points: [
      "Progressive summarisation blurs numbers, dates and stated expectations.",
      '"Lost in the middle": start and end of long inputs are read reliably, middle sections get missed.',
      "Keep a persistent \"case facts\" block outside summarised history; trim verbose tool output to relevant fields.",
      "Put key findings first and use explicit section headers; have subagents return structured data with metadata.",
    ], refs: ["context"] },
  { id: "5.2", domainId: "context", title: "Design escalation and ambiguity resolution patterns",
    points: [
      "Escalate on: explicit request for a human, policy gaps/exceptions, no meaningful progress.",
      "Honour an explicit human request immediately; for simple issues acknowledge frustration and offer resolution first.",
      "Sentiment and self-reported confidence are unreliable proxies for case complexity.",
      "Multiple matches: ask for another identifier; do not guess by heuristic. Put explicit criteria plus few-shot examples in the prompt.",
    ], refs: ["prompting"] },
  { id: "5.3", domainId: "context", title: "Implement error propagation across multi-agent systems",
    points: [
      "Return structured error context: failure type, attempted query, partial results, alternatives.",
      "Distinguish access failures from valid empty results.",
      "Anti-patterns: swallowing errors as empty success, or killing the whole workflow on one failure.",
      "Subagents recover locally from transient errors and escalate only what they cannot fix; annotate coverage gaps in the output.",
    ], refs: ["sdk", "mcpintro"] },
  { id: "5.4", domainId: "context", title: "Manage context in large codebase exploration",
    points: [
      "Long sessions degrade: inconsistent answers, generic \"typical patterns\" instead of specific classes found earlier.",
      "Scratchpad files persist key findings across context boundaries.",
      "Delegate verbose exploration to subagents; inject summaries into the next phase.",
      "Crash recovery via exported agent state (manifest); use /compact when context fills with discovery output.",
    ], refs: ["context", "subagents", "workflows"] },
  { id: "5.5", domainId: "context", title: "Design human review workflows and confidence calibration",
    points: [
      "Overall accuracy (e.g. 97%) can hide poor results on specific document types or fields.",
      "Stratified random sampling of high-confidence outputs measures error rates and finds new error patterns.",
      "Calibrate field-level confidence on a labelled validation set before routing or automating.",
      "Route low-confidence or contradictory documents to humans first.",
    ], refs: ["prompting"] },
  { id: "5.6", domainId: "context", title: "Preserve provenance and handle uncertainty in multi-source synthesis",
    points: [
      "Attribution is lost when findings are summarised without claim-to-source mappings.",
      "Subagents output structured claim-source mappings; synthesis preserves and merges them.",
      "Conflicting statistics: annotate both with sources rather than silently picking one.",
      "Require publication/collection dates so time differences are not read as contradictions; render each content type appropriately.",
    ], refs: ["sdk"] },
];

export const TASK_BY_ID = Object.fromEntries(CCAF_TASKS.map((t) => [t.id, t]));

/** Which task statements each CCA-F session covers. Fridays are tool labs, Sundays are review quizzes. */
export const SESSION_TASKS: Record<string, string[]> = {
  "W1.1": ["3.1", "3.2", "3.3"],
  "W1.2": ["3.4", "3.5", "3.6"],
  "W2.1": ["1.1", "1.2"],
  "W2.2": ["1.3", "1.4"],
  "W3.1": ["1.5", "1.6"],
  "W3.2": ["1.7"],
  "W4.1": ["2.1", "2.2"],
  "W4.2": ["2.3", "2.4", "2.5"],
  "W5.1": ["4.1", "4.2", "4.3"],
  "W5.2": ["4.4", "4.5", "4.6"],
  "W6.1": ["5.1", "5.2", "5.3"],
  "W6.2": ["5.4", "5.5", "5.6"],
};

export interface Exercise { id: string; title: string; summary: string; domains: string }

/** Official preparation exercises, Exam Guide section 8. */
export const EXERCISES: Exercise[] = [
  { id: "E1", title: "Build a multi-tool agent with escalation logic", summary: "3-4 MCP tools with sharp descriptions, an agentic loop on stop_reason, structured errors, a threshold hook that escalates, and a multi-concern test.", domains: "D1, D2, D5" },
  { id: "E2", title: "Configure Claude Code for a team workflow", summary: "Project CLAUDE.md, path-scoped .claude/rules/, a forked skill with allowed-tools, .mcp.json with env vars plus a personal server, and plan mode vs direct execution.", domains: "D3, D2" },
  { id: "E3", title: "Build a structured data extraction pipeline", summary: "tool_use JSON schema with nullable fields and enum+other, validation-retry loop, few-shot for varied formats, a 100-document batch by custom_id, confidence-based review routing.", domains: "D4, D5" },
  { id: "E4", title: "Design and debug a multi-agent research pipeline", summary: "Coordinator with Task-tool subagents, parallel calls, claim/source/date outputs, simulated timeout with partial results, and conflicting-source handling.", domains: "D1, D2, D5" },
];

export const EXAM_FACTS = [
  "60 items, multiple-choice and multiple-response (each item says how many to pick).",
  "4 scenarios drawn at random from a bank of 6; 120 minutes; proctored.",
  "Pass mark: scaled score 720 on a 100-1,000 scale. Fee $125. Valid 12 months.",
  "Report shows percent-correct per domain.",
];
