import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Study Planner",
    short_name: "Study",
    description: "Personal study plan, quizzes and progress tracker",
    start_url: "/",
    display: "standalone",
    background_color: "#14233a",
    theme_color: "#14233a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
