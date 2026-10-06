"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/plan", label: "Plan" },
  { href: "/quiz", label: "Quiz" },
  { href: "/labs", label: "Labs" },
  { href: "/progress", label: "Progress" },
  { href: "/topics", label: "Topics" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <div className="md:flex min-h-screen">
      {/* Desktop: left rail + menu (Canvas-style) */}
      <aside className="hidden md:flex md:flex-col w-52 shrink-0 bg-rail text-white p-4 gap-1">
        <div className="mb-6 text-lg font-semibold tracking-tight">Study Planner</div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`rounded px-3 py-2 text-sm ${
              active(n.href) ? "bg-white/15 font-medium" : "text-white/70 hover:bg-white/10"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 md:pb-8 max-w-4xl">{children}</main>

      {/* Phone: bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-rail text-white flex">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex-1 py-3 text-center text-[11px] ${
              active(n.href) ? "bg-white/15 font-medium" : "text-white/70"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
