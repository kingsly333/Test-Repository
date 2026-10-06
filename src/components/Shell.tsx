"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Today", icon: "◉" },
  { href: "/plan", label: "Plan", icon: "▤" },
  { href: "/quiz", label: "Quiz", icon: "✎" },
  { href: "/labs", label: "Labs", icon: "⚙" },
  { href: "/progress", label: "Progress", icon: "◔" },
  { href: "/topics", label: "Topics", icon: "☰" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <div className="md:flex min-h-screen">
      {/* Desktop: left rail */}
      <aside className="hidden md:flex md:flex-col w-56 shrink-0 bg-rail text-white p-4 gap-1 sticky top-0 h-screen">
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold">S</span>
          <span className="text-lg font-semibold tracking-tight">Study Planner</span>
        </div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              active(n.href) ? "bg-white/15 font-medium" : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="w-4 text-center">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </aside>

      <main className="min-w-0 flex-1 p-4 pb-28 md:p-10 md:pb-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      {/* Phone: bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 flex border-t border-white/10 bg-rail pb-[env(safe-area-inset-bottom)] text-white">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              active(n.href) ? "font-medium text-white" : "text-white/55"
            }`}
          >
            <span className="text-base leading-none">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
