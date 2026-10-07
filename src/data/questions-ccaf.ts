// CCA-F question bank (42 items), written once (Rule 8).
// Source of truth: "Claude Certified Architect – Foundations Exam Guide" v1.0 (July 2026):
//  - section 5 scenarios (paraphrased below), section 6 task statements (cited per question).
// Questions are original (not the guide's section 9 samples). Each cites its task statement plus
// the official docs page for that task (links checked HTTP 200 on 2026-10-06, see modules.ts) (Rule 5).
// Domain mix follows the blueprint: D1 27%, D2 18%, D3 20%, D4 20%, D5 15%.

import { R, TASK_BY_ID } from "./modules";
import type { Question, Scenario } from "./questions";

export const CCAF_SCENARIOS: Record<string, Scenario> = {
  support: {
    id: "support",
    title: "Customer Support Resolution Agent",
    text:
      "You are building a customer support resolution agent with the Claude Agent SDK. It handles returns, billing " +
      "disputes and account issues through custom MCP tools (get_customer, lookup_order, process_refund, " +
      "escalate_to_human). The target is 80%+ first-contact resolution while knowing when to escalate.",
  },
  codegen: {
    id: "codegen",
    title: "Code Generation with Claude Code",
    text:
      "Your team uses Claude Code for code generation, refactoring, debugging and documentation. You are " +
      "integrating it into the workflow with custom slash commands, CLAUDE.md configuration, and a view on when " +
      "to use plan mode versus direct execution.",
  },
  research: {
    id: "research",
    title: "Multi-Agent Research System",
    text:
      "A coordinator agent built with the Claude Agent SDK delegates to subagents: one searches the web, one " +
      "analyses documents, one synthesises findings, one generates reports. The system produces cited, " +
      "comprehensive reports on a topic.",
  },
  devprod: {
    id: "devprod",
    title: "Developer Productivity with Claude",
    text:
      "You are building developer tools with the Claude Agent SDK. The agent helps engineers explore unfamiliar " +
      "codebases, understand legacy systems, generate boilerplate and automate repetitive tasks, using built-in " +
      "tools (Read, Write, Bash, Grep, Glob) and MCP servers.",
  },
  ci: {
    id: "ci",
    title: "Claude Code for Continuous Integration",
    text:
      "You are integrating Claude Code into a CI/CD pipeline for automated code reviews, test generation and pull " +
      "request feedback. Prompts must give actionable feedback and keep false positives low.",
  },
  extraction: {
    id: "extraction",
    title: "Structured Data Extraction",
    text:
      "You are building a system that extracts information from unstructured documents (such as invoices), " +
      "validates the output against JSON schemas, and keeps accuracy high. It must handle edge cases and feed " +
      "downstream systems.",
  },
};

/** One question. `answer` is an index, or several indexes for a "select 2" item. */
function q(
  id: string,
  scenarioId: string,
  taskId: string,
  prompt: string,
  choices: string[],
  answer: number | number[],
  explanation: string,
): Question {
  const task = TASK_BY_ID[taskId];
  const ref = R[task.refs[0]];
  return {
    id: `ccaf-${id}`,
    topicId: "ccaf",
    domainId: task.domainId,
    taskId,
    scenarioId,
    prompt,
    choices,
    answer: Array.isArray(answer) ? answer : [answer],
    explanation,
    source: { label: `CCA-F Exam Guide v1.0, task ${taskId} · ${ref.label}`, url: ref.url },
  };
}

export const CCAF_QUESTIONS: Question[] = [
  // ======== Domain 1: Agentic Architecture & Orchestration (11) ========
  q("1.1a", "support", "1.1",
    "Your agent loop must stop at the right moment. After the model replies \"I've finished processing your refund,\" which signal should the loop use to decide the turn is complete?",
    [
      "The response's stop_reason is \"end_turn\".",
      "The reply text contains a completion phrase such as \"finished\" or \"done\".",
      "A fixed cap of 5 iterations has been reached.",
      "The response contains no tool names in its text.",
    ], 0,
    "The loop continues while stop_reason is \"tool_use\" and ends on \"end_turn\". Parsing natural language, relying on an iteration cap as the main stop, or inferring completion from the presence of text are listed anti-patterns."),

  q("1.1b", "devprod", "1.1",
    "Your agent called a Grep tool and the tool has executed. What must happen before the next model request so the agent can reason about its next step?",
    [
      "Start a new conversation containing only a one-line summary of the result.",
      "Send only the tool result, without the earlier messages, to save tokens.",
      "Append the tool result to the conversation history and send the whole history back.",
      "Discard the assistant's tool request message so the history stays short.",
    ], 2,
    "Tool results are appended to the conversation history; the model reasons over that history to choose its next action. Dropping messages or history breaks the loop's reasoning."),

  q("1.2a", "research", "1.2",
    "For a narrow factual question, your coordinator still runs all four subagents (search, analysis, synthesis, report) every time, wasting time and cost. What is the best change?",
    [
      "Let the subagents message each other directly so the coordinator is not involved.",
      "Have the coordinator select which subagents to invoke based on the query's complexity.",
      "Keep running all four but run them in parallel.",
      "Remove the coordinator and run a fixed pipeline.",
    ], 1,
    "In hub-and-spoke designs the coordinator decomposes, delegates and picks subagents by query complexity rather than always running the full pipeline. Routing everything through the coordinator also keeps error handling and communication in one place."),

  q("1.2b", "research", "1.2",
    "A report on \"renewable energy\" covers only solar and wind. Hydro and geothermal are missing. Every subagent completed successfully and its output was accurate. What is the most likely root cause?",
    [
      "The coordinator decomposed the topic too narrowly.",
      "The web-search subagent's tool timed out silently.",
      "The synthesis subagent's context window is too small.",
      "The report subagent's temperature setting is too low.",
    ], 0,
    "When subagents do their assigned work correctly but coverage is incomplete, the fault is in the coordinator's task decomposition. Narrow decomposition leads to incomplete coverage."),

  q("1.3a", "research", "1.3",
    "The synthesis subagent produces generic prose and ignores specific facts the search subagent found earlier. Both ran under the same coordinator. What is the most direct fix?",
    [
      "Increase the synthesis subagent's maximum output tokens.",
      "Pass the search findings explicitly in the synthesis subagent's prompt.",
      "Wait for the search subagent to finish, then restart the whole coordinator.",
      "Rely on shared memory so the synthesis subagent reads the search subagent's history.",
    ], 1,
    "Subagents have isolated context: they do not inherit the coordinator's history or share memory. Findings must be passed in the subagent's prompt."),

  q("1.3b", "research", "1.3",
    "The coordinator must run the web-search and document-analysis subagents at the same time. Select TWO actions that make this work.",
    [
      "Include \"Task\" in the coordinator's allowedTools.",
      "Emit multiple Task tool calls in a single coordinator response.",
      "Rely on shared memory between subagents so each sees the other's work.",
      "Wait for the first subagent to return before spawning the second, to guarantee ordering.",
    ], [0, 1],
    "The coordinator spawns subagents with the Task tool, so its allowedTools must include \"Task\". Parallel subagents come from emitting several Task calls in one response. Subagents have no shared memory, and waiting serialises the work."),

  q("1.4", "support", "1.4",
    "When the agent escalates a case, the human agent will not see the conversation transcript. What should escalate_to_human pass along?",
    [
      "The customer's details, the root cause and a recommended action.",
      "The raw transcript only.",
      "Only the ticket ID, so the human can look it up.",
      "The model's own confidence score and nothing else.",
    ], 0,
    "A handoff to a human who lacks the transcript must be self-contained: customer details, root cause and recommended action. A bare ID or score does not let them act."),

  q("1.5a", "support", "1.5",
    "lookup_order returns dates as Unix timestamps and statuses as numeric codes, and the agent sometimes misreads them. What is the most reliable fix?",
    [
      "Add a paragraph to the system prompt explaining every code and timestamp.",
      "Ask the model to double-check each value before answering.",
      "Use a PostToolUse hook to normalise dates and status codes before the model sees the result.",
      "Add few-shot examples of timestamps being converted.",
    ], 2,
    "PostToolUse hooks transform tool results (timestamps, status codes) before the model sees them, giving a deterministic fix. Prompt-based approaches rely on probabilistic compliance."),

  q("1.5b", "support", "1.5",
    "Policy says refunds above $500 need human approval, yet the agent occasionally issues them. Which approach gives a deterministic guarantee?",
    [
      "Add the policy to the system prompt in bold capital letters.",
      "Add few-shot examples that always escalate large refunds.",
      "Ask the agent to report its confidence before each refund.",
      "Use a hook on outgoing process_refund calls that blocks amounts over the threshold and redirects to escalation.",
    ], 3,
    "Hooks intercept outgoing tool calls and enforce rules deterministically. Prompts, examples and self-reported confidence all leave a non-zero failure rate, which is unacceptable for financial limits."),

  q("1.6", "ci", "1.6",
    "A pull request changes 14 files. A single-pass review gives uneven depth and misses issues that span files. What is the best structure?",
    [
      "Run one pass per file for local issues, then a separate cross-file integration pass.",
      "Review all 14 files in one pass but ask for more thorough output.",
      "Review only the three largest files.",
      "Review files alphabetically and stop when the context fills.",
    ], 0,
    "Large reviews are split into per-file local passes plus a separate cross-file integration pass, which avoids attention dilution on big inputs."),

  q("1.7", "devprod", "1.7",
    "Yesterday you analysed a module in a named session. Overnight, teammates changed three files in it. How should you continue today?",
    [
      "Resume the session and assume its earlier findings still hold.",
      "Resume the session with --resume and tell it which files changed so it re-reads them.",
      "Always start a fresh session with no context, whatever changed.",
      "Fork the session and ignore the file changes.",
    ], 1,
    "--resume <session-name> continues a specific conversation. After code changes, tell the resumed session which files changed. If prior tool results are mostly stale, start fresh with a structured summary instead."),

  // ======== Domain 2: Tool Design & MCP Integration (8) ========
  q("2.1a", "support", "2.1",
    "You rewrote get_customer and lookup_order with detailed descriptions, but the agent still calls get_customer for order questions that mention \"my account.\" What should you inspect next?",
    [
      "Whether the system prompt contains keyword-sensitive wording that biases the agent toward get_customer.",
      "Whether the model's temperature is too high.",
      "Whether the tools should be merged into one lookup_entity tool.",
      "Whether the descriptions are too long.",
    ], 0,
    "Even good descriptions can be overridden by keyword-sensitive instructions in the system prompt. Check the prompt wording before adding infrastructure."),

  q("2.1b", "support", "2.1",
    "Two tools accept similar identifiers and are being confused. Select TWO additions to their descriptions that most improve selection.",
    [
      "The input formats the tool accepts, with example queries.",
      "A boundary saying when to use this tool versus the similar one.",
      "A history of how the tool was built.",
      "Every column name in the backend database.",
    ], [0, 1],
    "Tool descriptions are the main signal for selection. Input formats, example queries, edge cases and when-to-use-versus-similar-tool boundaries help the model choose. History and schema dumps do not."),

  q("2.2a", "support", "2.2",
    "lookup_order times out. Currently the tool returns the text \"Operation failed.\" What should it return instead?",
    [
      "An empty result, so the agent moves on.",
      "An error flagged with isError, an errorCategory of transient, and isRetryable set to true.",
      "A thrown exception that ends the whole workflow.",
      "The same \"Operation failed\" text, but repeated three times.",
    ], 1,
    "Structured errors carry the isError flag, an errorCategory (transient, validation, business-rule, permission) and isRetryable so the agent can decide what to do. Generic text or an empty result hides the real situation."),

  q("2.2b", "support", "2.2",
    "process_refund rejects a request because it is outside the return window. What should the tool return so the agent behaves correctly?",
    [
      "A transient error, so the agent retries until it works.",
      "An empty success result.",
      "A business-rule error with isRetryable false and a customer-friendly explanation.",
      "A generic \"Operation failed\" message.",
    ], 2,
    "Business-rule violations are not retryable. Returning isRetryable false plus a customer-friendly explanation stops pointless retries and lets the agent explain the policy."),

  q("2.3a", "research", "2.3",
    "The synthesis agent has 18 tools, including web search, and keeps searching instead of synthesising. What is the best fix?",
    [
      "Add a stronger line to its prompt saying not to search.",
      "Give it more tools so it has better options.",
      "Restrict it to the 4-5 tools its role needs and leave web search to the search agent.",
      "Increase its token budget.",
    ], 2,
    "Too many tools degrade selection, and agents misuse tools outside their specialty. Give each agent only the tools its role needs."),

  q("2.3b", "extraction", "2.3",
    "The document type is unknown, but the model must always call one of three extraction tools and never reply in plain text. Which tool_choice setting fits?",
    [
      "\"auto\"",
      "A forced tool: {\"type\":\"tool\",\"name\":\"extract_invoice\"}",
      "\"any\"",
      "No tool_choice and a strongly worded prompt",
    ], 2,
    "\"any\" forces the model to call some tool but lets it pick which. \"auto\" may return text. A forced tool name always calls that specific tool, which is wrong when the type is unknown."),

  q("2.4", "devprod", "2.4",
    "Your team shares a GitHub MCP server through the repository, but the access token must never be committed. What is the right setup?",
    [
      "Put the token directly in .mcp.json in a private repo.",
      "Commit ~/.claude.json to the repo.",
      "Put the token in CLAUDE.md so Claude can use it.",
      "Use a project-scoped .mcp.json with ${GITHUB_TOKEN} environment-variable expansion.",
    ], 3,
    "Project scope (.mcp.json) is shared; expanding ${GITHUB_TOKEN} reads the secret from each developer's environment so it is never committed. User scope (~/.claude.json) is personal."),

  q("2.5", "devprod", "2.5",
    "You need to find every place retryPolicy is referenced, and also list all files named *.config.ts. Select the TWO built-in tools that fit these two jobs.",
    [
      "Grep, to search file contents.",
      "Glob, to match file paths.",
      "Edit, to make targeted text changes.",
      "Write, to create the result as a new file.",
    ], [0, 1],
    "Grep searches file contents; Glob matches file paths. Read/Write handle whole files and Edit does targeted unique-text changes; none of those answers either search."),

  // ======== Domain 3: Claude Code Configuration & Workflows (8) ========
  q("3.1a", "codegen", "3.1",
    "A new teammate reports Claude behaving differently on the same repository. What should you check first?",
    [
      "Run /memory to see which memory files loaded for them.",
      "Reinstall Claude Code.",
      "Delete the project's CLAUDE.md.",
      "Switch them to plan mode.",
    ], 0,
    "/memory shows which memory files loaded, which is the first diagnostic for inconsistent behaviour. Often a personal user-level file is the difference."),

  q("3.1b", "codegen", "3.1",
    "One developer wants Claude to follow a personal formatting preference across all their projects, without affecting teammates. Where should it live?",
    [
      "The project's root CLAUDE.md.",
      "A CLAUDE.md in a subdirectory of the repo.",
      "~/.claude/CLAUDE.md (user level).",
      ".claude/rules/ in the repository.",
    ], 2,
    "User-level instructions in ~/.claude/CLAUDE.md are personal and are not shared through version control. Project and directory files are shared with the team."),

  q("3.2", "codegen", "3.2",
    "A skill that analyses the whole codebase produces huge output that clutters the main conversation. What should you change?",
    [
      "Add context: fork to the skill's frontmatter so it runs in an isolated sub-agent.",
      "Move the skill's text into CLAUDE.md.",
      "Ask the model to be brief.",
      "Rename the skill.",
    ], 0,
    "context: fork runs a skill in an isolated sub-agent so verbose output does not pollute the main chat."),

  q("3.3", "codegen", "3.3",
    "Migration conventions matter only when editing files under db/migrations/. Putting them in the root CLAUDE.md wastes context on every session. What is the best approach?",
    [
      "Keep them in root CLAUDE.md and shorten them.",
      "Create a .claude/rules/ file with a paths: glob so it loads only when matching files are edited.",
      "Ask developers to paste them when needed.",
      "Create a skill and hope Claude invokes it.",
    ], 1,
    "Path-scoped rules with glob frontmatter load only when editing matching files, which saves context and tokens."),

  q("3.4", "codegen", "3.4",
    "Select the TWO tasks best suited to plan mode.",
    [
      "Rename a variable in a single file.",
      "Migrate authentication from sessions to OAuth across 40 files where two designs are viable.",
      "Add a null check shown clearly in a stack trace.",
      "Decide between an event-driven and a request-response design for a new subsystem.",
    ], [1, 3],
    "Plan mode fits large changes, multiple valid approaches and architectural decisions. Simple, well-scoped changes with a clear fix suit direct execution."),

  q("3.5", "codegen", "3.5",
    "Claude converts CSV rows to JSON inconsistently even though your written instructions are detailed. What is the most effective change?",
    [
      "Make the instructions longer and more formal.",
      "Provide 2-3 concrete input and output examples.",
      "Retry until the output looks right.",
      "Switch to a different file format.",
    ], 1,
    "When prose is interpreted inconsistently, 2-3 concrete input/output examples work better than more description."),

  q("3.6a", "ci", "3.6",
    "Your CI job runs claude and hangs, waiting for input that never comes. What fixes it?",
    [
      "Run claude in a terminal emulator.",
      "Add a sleep before the command.",
      "Run it with -p / --print for non-interactive mode.",
      "Set a higher timeout only.",
    ], 2,
    "-p (--print) runs Claude Code non-interactively so pipelines do not wait for input."),

  q("3.6b", "ci", "3.6",
    "A re-run of the CI review posts duplicate comments on findings the developer already addressed. What should you do?",
    [
      "Include the prior review findings in context so only new or unaddressed issues are reported.",
      "Delete all old comments before every run.",
      "Reduce the review to one comment per file.",
      "Run the review twice and merge the output.",
    ], 0,
    "Passing prior findings on re-runs avoids duplicate comments. A fresh independent session also reviews better than the one that wrote the code."),

  // ======== Domain 4: Prompt Engineering & Structured Output (8) ========
  q("4.1", "ci", "4.1",
    "Developers dismiss many minor-style comments from your review, and trust in the accurate security findings is dropping. What is the best prompt change?",
    [
      "Add \"be conservative and only report high-confidence issues.\"",
      "State explicit categories to report (bugs, security) and to skip (minor style), with severity examples.",
      "Ask the model to attach a confidence number and filter on it.",
      "Make the review comments shorter.",
    ], 1,
    "Explicit categorical criteria beat vague instructions like \"be conservative.\" False positives in one category erode trust in the accurate ones. You can also temporarily disable a noisy category while you fix its prompt."),

  q("4.2", "extraction", "4.2",
    "Extraction is inconsistent across invoice layouts: some put the total in a footer, others inline. What most reliably improves consistency?",
    [
      "Add 2-4 targeted few-shot examples covering the varied layouts.",
      "Tell the model to try harder.",
      "Lower the output length limit.",
      "Process each invoice twice and average the results.",
    ], 0,
    "Few-shot examples are the strongest fix when instructions alone give inconsistent output, and they help generalise across varied document structures."),

  q("4.3a", "extraction", "4.3",
    "The model occasionally returns JSON with missing brackets. Which approach most reliably guarantees schema-valid output?",
    [
      "Add \"respond only in valid JSON\" to the prompt.",
      "Write regex repairs for common mistakes.",
      "Retry until the output parses.",
      "Use tool_use with a JSON schema.",
    ], 3,
    "tool_use with a JSON schema is the most reliable route to schema-valid output with no syntax errors. It does not prevent semantic errors."),

  q("4.3b", "extraction", "4.3",
    "Some invoices have no PO number, and the model invents plausible ones. What schema change fixes this?",
    [
      "Make the PO number field required.",
      "Make the PO number field optional or nullable.",
      "Add a longer field description.",
      "Increase the max token limit.",
    ], 1,
    "Optional or nullable fields let the model return null when the source lacks the information, instead of fabricating a value to satisfy a required field."),

  q("4.4", "extraction", "4.4",
    "An extraction fails validation because line items do not add up to the stated total. What should the retry request contain?",
    [
      "Just the original document again.",
      "Only the validation error message.",
      "A request to extract again with a different tone.",
      "The document, the failed extraction and the specific validation error.",
    ], 3,
    "Retry with the document, the failed extraction and the specific error appended so the model can correct it. Retries fix format and structure errors, but not information that is absent from the source."),

  q("4.5a", "ci", "4.5",
    "Workload X is a blocking pre-merge check developers wait on. Workload Y is a weekly report over 5,000 files. Which should use the Message Batches API?",
    [
      "X only.",
      "Both X and Y.",
      "Neither, because batches are unreliable.",
      "Y only.",
    ], 3,
    "Batches are 50% cheaper but take up to 24 hours with no latency guarantee, so they suit overnight or weekly work, not blocking checks."),

  q("4.5b", "extraction", "4.5",
    "A batch of 100 documents returns, but 7 failed because they were too large. What is the best next step?",
    [
      "Rerun all 100 documents.",
      "Resubmit only the 7 failed items, matched by custom_id, after chunking them.",
      "Drop the 7 documents.",
      "Switch the whole workload to synchronous calls.",
    ], 1,
    "custom_id lets you match results to inputs and resubmit only the failures, for example after chunking oversize documents."),

  q("4.6", "ci", "4.6",
    "The same session that wrote a change is asked to review it and finds almost nothing. What produces a better review?",
    [
      "Ask the same session to think longer.",
      "Ask it to review again in a stricter tone.",
      "Use an independent instance with no access to the earlier reasoning.",
      "Review only the diff header.",
    ], 2,
    "A model reviewing its own output in the same session keeps its reasoning bias. Independent instances catch more than self-review or extended thinking."),

  // ======== Domain 5: Context Management & Reliability (7) ========
  q("5.1", "support", "5.1",
    "In long conversations the agent loses exact refund amounts and promised dates after summarisation. What is the best fix?",
    [
      "Summarise more often.",
      "Keep a persistent \"case facts\" block outside the summarised history.",
      "Switch to a larger model and stop summarising.",
      "Ask the customer to repeat the details.",
    ], 1,
    "Progressive summarisation blurs numbers, dates and stated expectations. Keep critical facts in a persistent block outside the summarised history."),

  q("5.2a", "support", "5.2",
    "A customer writes \"I want to talk to a human.\" The issue looks simple. What should the agent do?",
    [
      "Try to resolve it first, then offer a human.",
      "Ask why they want a human.",
      "Honour the request and escalate immediately.",
      "Run sentiment analysis to decide.",
    ], 2,
    "An explicit request for a human is honoured immediately. For other simple issues, acknowledging frustration and offering resolution first is fine."),

  q("5.2b", "support", "5.2",
    "get_customer returns three customers matching a name. What should the agent do?",
    [
      "Ask the customer for another identifier.",
      "Pick the most recently active account.",
      "Pick the first match.",
      "Process the refund on all three.",
    ], 0,
    "With multiple matches, ask for an additional identifier rather than guessing by heuristic."),

  q("5.3", "research", "5.3",
    "The web-search subagent times out. What should the coordinator receive so the report can still be produced?",
    [
      "An empty result, so it can carry on.",
      "A generic \"search failed\" message.",
      "A signal that terminates the entire workflow.",
      "Structured error context: failure type, attempted query, partial results and alternatives.",
    ], 3,
    "Return structured error context so the coordinator can recover, and annotate the coverage gap in the output. Swallowing errors as empty success or killing the workflow are anti-patterns."),

  q("5.4", "devprod", "5.4",
    "Late in a long codebase exploration the agent starts giving generic \"typical patterns\" instead of the specific classes it found earlier. What helps most?",
    [
      "Keep going; the answers will recover.",
      "Persist key findings in a scratchpad file and delegate verbose exploration to subagents.",
      "Ask it to be more specific.",
      "Re-read every file from the beginning.",
    ], 1,
    "Long sessions degrade. Scratchpad files persist findings across context boundaries, and subagents isolate verbose exploration. /compact also helps when discovery output fills the context."),

  q("5.5", "extraction", "5.5",
    "Your pipeline reports 97% overall accuracy. Is it safe to automate fully?",
    [
      "Yes. 97% is above any sensible threshold.",
      "Yes, if you add a confidence score.",
      "No. Check accuracy by document type and field with stratified sampling and calibrate confidence on a labelled set first.",
      "No, and the pipeline should be abandoned.",
    ], 2,
    "Aggregate accuracy can hide poor results on specific document types or fields. Stratified sampling and a labelled validation set reveal where human review is still needed."),

  q("5.6", "research", "5.6",
    "Two sources report different figures for the same statistic. How should the synthesis agent handle it?",
    [
      "Silently use the more recent figure.",
      "Average the two figures.",
      "Drop the statistic.",
      "Present both with their sources and dates.",
    ], 3,
    "Conflicting statistics are annotated with their sources, and publication or collection dates are kept so time differences are not mistaken for contradictions."),
];
