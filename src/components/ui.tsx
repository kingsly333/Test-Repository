import type { Status } from "@/lib/scoring";
import { STATUS_LABEL } from "@/lib/scoring";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-surface p-4 ${className}`}>{children}</div>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-light mb-6">{children}</h1>;
}

export function Btn({
  children, onClick, kind = "ghost", disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "primary" | "ghost";
  disabled?: boolean;
}) {
  const style =
    kind === "primary"
      ? "bg-accent text-white"
      : "border border-line text-foreground hover:bg-line/40";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-1.5 text-sm disabled:opacity-40 ${style}`}
    >
      {children}
    </button>
  );
}

const DOT: Record<Status, string> = { green: "bg-green-500", amber: "bg-amber-500", red: "bg-red-500" };

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Bar({ value, className = "bg-accent" }: { value: number; className?: string }) {
  return (
    <div className="h-2 w-full rounded bg-line">
      <div className={`h-2 rounded ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
