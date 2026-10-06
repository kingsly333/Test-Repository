import type { Status } from "@/lib/scoring";
import { STATUS_LABEL } from "@/lib/scoring";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface p-4 shadow-sm ${className}`}>{children}</div>;
}

export function H1({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>
      {sub && <p className="mt-1 text-muted">{sub}</p>}
    </div>
  );
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
      ? "bg-accent text-white shadow-sm hover:opacity-90"
      : "border border-line bg-surface text-foreground hover:bg-line/50";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-40 ${style}`}
    >
      {children}
    </button>
  );
}

const DOT: Record<Status, string> = { green: "bg-green-500", amber: "bg-amber-500", red: "bg-red-500" };

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-line/50 px-2.5 py-1 text-xs font-medium">
      <span className={`h-2 w-2 rounded-full ${DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Bar({ value, className = "bg-accent" }: { value: number; className?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-line">
      <div className={`h-2 rounded-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
