"use client";

import { useState } from "react";
import { addStuck } from "@/lib/store";
import { Btn } from "@/components/ui";

/** One-line capture of something I didn't understand. Shown on a session card or module page. */
export function StuckForm({ topicId, sessionId }: { topicId: string; sessionId?: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setSaved(false); }}
        className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-line/40"
      >
        {saved ? "✓ Saved. Add another" : "Didn’t get it"}
      </button>
    );
  }
  return (
    <div className="mt-2 w-full">
      <textarea
        autoFocus
        placeholder="What didn't make sense? One line is enough."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-line bg-transparent p-2 text-sm"
        rows={2}
      />
      <div className="mt-2 flex gap-2">
        <Btn
          kind="primary"
          disabled={!text.trim()}
          onClick={() => {
            addStuck({ topicId, sessionId, text });
            setText("");
            setOpen(false);
            setSaved(true);
          }}
        >
          Save to stuck list
        </Btn>
        <Btn onClick={() => { setOpen(false); setText(""); }}>Cancel</Btn>
      </div>
    </div>
  );
}
