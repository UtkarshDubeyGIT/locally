import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  actorHome: vi.fn(),
  getActor: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  actorHome: mocks.actorHome,
  getActor: mocks.getActor,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import Home from "@/app/page";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getActor.mockResolvedValue(null);
});

test("introduces signed-out visitors to Locally and leads them into the workspace", async () => {
  const view = render(await Home());

  expect(mocks.redirect).not.toHaveBeenCalled();
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Local search, managed.",
    }),
  ).toBeVisible();
  expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible();
  expect(
    screen.getByText(
      /reviews, listings, audits, actions and monthly updates/i,
    ),
  ).toBeVisible();

  const workspaceLink = screen.getByRole("link", {
    name: "Sign in",
  });
  expect(workspaceLink).toHaveAttribute("href", "/login");
  expect(screen.queryByText(/\bbrief\b/i)).not.toBeInTheDocument();

  expect(view.container.querySelectorAll('a[href="/login"]')).toHaveLength(1);
  expect(view.container.querySelectorAll(".eyebrow").length).toBeLessThanOrEqual(1);
  expect(view.container.querySelector('[class*="heroSpine"]')).toBeNull();
  expect(view.container.querySelector("[data-sweet-motion]")).toBeNull();
  expect(screen.queryByText(/from signal to story/i)).not.toBeInTheDocument();
});

test("keeps authenticated visitors on the direct path to their role workspace", async () => {
  mocks.getActor.mockResolvedValue({ role: "agency_owner" });
  mocks.actorHome.mockReturnValue("/agency");

  await Home();

  expect(mocks.actorHome).toHaveBeenCalledWith("agency_owner");
  expect(mocks.redirect).toHaveBeenCalledWith("/agency");
});

test("keeps the hero photograph above its fallback background", () => {
  const css = readFileSync(
    join(process.cwd(), "src/app/landing.module.css"),
    "utf8",
  );
  const heroImageRule = css.match(/\.heroImage\s*\{([^}]*)\}/)?.[1];

  expect(heroImageRule).toBeDefined();
  expect(heroImageRule).toMatch(/z-index:\s*0\s*;/);
});
