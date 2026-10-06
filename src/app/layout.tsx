import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Personal study plan, quizzes and progress tracker",
  appleWebApp: { capable: true, title: "Study Planner", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#14233a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
