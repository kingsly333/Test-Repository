// All dates are plain "YYYY-MM-DD" strings in IST-local terms (no time zone math).

export function parse(d: string): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

export function fmt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(d: string, n: number): string {
  const x = parse(d);
  x.setDate(x.getDate() + n);
  return fmt(x);
}

export function today(): string {
  return fmt(new Date());
}

export function pretty(d: string): string {
  return parse(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Next Thursday or Saturday strictly after `from`. Tuesdays are never used (Rule 6). */
export function nextCatchUp(from: string): string {
  let d = addDays(from, 1);
  for (let i = 0; i < 8; i++) {
    const wd = parse(d).getDay(); // 4 = Thu, 6 = Sat
    if (wd === 4 || wd === 6) return d;
    d = addDays(d, 1);
  }
  return d;
}
