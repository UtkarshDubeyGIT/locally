import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Locally",
    short_name: "Locally",
    description: "A calm operating system for local-search work.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#f7dc00",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
