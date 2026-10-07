"use client";

import { useState } from "react";
import { addStuck, removeStuck, resolveStuck, useStore, type StuckItem } from "@/lib/store";
import { pretty } from "@/lib/dates";
import { useHydrated } from "@/lib/hydrated";
import { allTopics, TopicTabs } from "@/components/TopicTabs";
import { Btn, Card, H1 } from "@/components/ui";

function exportMarkdown(items: StuckItem[], names: Record<string, string>): string {
  const byTopic = new Map<string, StuckItem[]>();
  for (const i of items) byTopic.set(i.topicId, [...(byTopic.get(i.topicId) ?? []), i]);
  const lines = ["# Things I did not understand", ""];
  for (const [topicId, list] of byTopic) {
    lines.push(`## ${names[topicId] ?? topicId}`);
    for (const i of list) lines.push(`- ${i.text}${i.sessionId ? ` (session ${i.sessionId})` : ""}`);
    lines.push("");
  }
  return lines.join("\n");
}

const NOTEBOOK_PROMPT =
  "For each item in my stuck list, explain it simply using only the uploaded sources. " +
  "Cite the source section for every claim. Then give me 2 check questions per item.";

const CLAUDE_PROMPT =
  "Read docs/stuck.md. For each item: explain it in plain steps, give one hands-on lab I can run, " +
  "and write 2 check questions with an official source link each. Save to docs/deep-dives/<topic>.md.";

export default function Stuck() {
  const hydrated = useHydrated();
  const state = useStore();
  const [topicId, setTopicId] = useState("ccaf");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState("");
  if (!hydrated) return <div className="h-96" />;

  const topics = allTopics(state.extraTopics);
  const names = Object.fromEntries(topics.map((t) => [t.id, t.name]));
  const inFilter = (i: StuckItem) => state.filter === "all" || i.topicId === state.filter;
  const open = state.stuck.filter((i) => !i.resolvedAt && inFilter(i));
  const resolved = state.stuck.filter((i) => i.resolvedAt && inFilter(i));
  const openAll = state.stuck.filter((i) => !i.resolvedAt);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("Copy blocked by the browser. Use Download instead.");
    }
  }

  function download() {
    const blob = new Blob([exportMarkdown(openAll, names)], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stuck.md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const row = (i: StuckItem) => (
    <li key={i.id} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${i.resolvedAt ? "text-muted line-through" : ""}`}>{i.text}</div>
        <div className="mt-1 text-xs text-muted">
          {names[i.topicId] ?? i.topicId}
          {i.sessionId && ` · ${i.sessionId}`} · {pretty(i.at.slice(0, 10))}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Btn onClick={() => resolveStuck(i.id, !i.resolvedAt)}>{i.resolvedAt ? "Reopen" : "Got it"}</Btn>
        <button onClick={() => removeStuck(i.id)} className="text-xs text-muted underline">delete</button>
      </div>
    </li>
  );

  return (
    <>
      <H1 sub="Things I didn't understand. Log them, then deep-dive in a batch.">Stuck list</H1>
      <TopicTabs />

      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          >
            {topics.map((t) => <option key={t.id} value={t.id}>{t.short}</option>)}
          </select>
          <input
            placeholder="What didn't make sense?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm sm:col-span-3"
          />
        </div>
        <div className="mt-3">
          <Btn kind="primary" disabled={!text.trim()} onClick={() => { addStuck({ topicId, text }); setText(""); }}>
            Add to stuck list
          </Btn>
        </div>
      </Card>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Open ({open.length})</h2>
      {open.length === 0 ? (
        <Card className="text-sm text-muted">Nothing stuck. Use &ldquo;Didn&apos;t get it&rdquo; on a session, or add one above.</Card>
      ) : (
        <ul className="space-y-2">{open.map(row)}</ul>
      )}

      {resolved.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-muted">Cleared ({resolved.length})</h2>
          <ul className="space-y-2">{resolved.map(row)}</ul>
        </>
      )}

      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-muted">Deep-dive</h2>
      <Card>
        <p className="text-sm">
          Exports all {openAll.length} open items (every topic, not just the filter) as markdown.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn kind="primary" disabled={openAll.length === 0} onClick={() => copy("List copied", exportMarkdown(openAll, names))}>
            Copy list
          </Btn>
          <Btn disabled={openAll.length === 0} onClick={download}>Download stuck.md</Btn>
          {copied && <span className="self-center text-xs text-muted">{copied}</span>}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Concepts: NotebookLM</div>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-muted">
              <li>Make one notebook per exam. Add the official exam guide and docs as sources, once.</li>
              <li>Add the copied list as a pasted-text source.</li>
              <li>Paste the prompt below into chat.</li>
            </ol>
            <p className="mt-2 rounded-lg bg-line/40 p-2 text-xs">{NOTEBOOK_PROMPT}</p>
            <div className="mt-2"><Btn onClick={() => copy("Prompt copied", NOTEBOOK_PROMPT)}>Copy prompt</Btn></div>
          </div>
          <div>
            <div className="text-sm font-medium">Tools and labs: Claude Code</div>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-muted">
              <li>Save the download as docs/stuck.md in the repo.</li>
              <li>Start Claude Code in the repo folder.</li>
              <li>Paste the prompt below. Costs tokens: do it as a weekly batch.</li>
            </ol>
            <p className="mt-2 rounded-lg bg-line/40 p-2 text-xs">{CLAUDE_PROMPT}</p>
            <div className="mt-2"><Btn onClick={() => copy("Prompt copied", CLAUDE_PROMPT)}>Copy prompt</Btn></div>
          </div>
        </div>
      </Card>
    </>
  );
}
