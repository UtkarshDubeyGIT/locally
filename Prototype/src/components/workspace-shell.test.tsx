import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("@/app/actions/auth", () => ({ logoutAction: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/agency" }));

import { WorkspaceShell } from "@/components/workspace-shell";
import type { Profile } from "@/lib/auth";

afterEach(cleanup);

const actor: Profile = {
  active: true,
  agency_id: "agency-a",
  client_id: null,
  created_at: "2026-07-15T00:00:00.000Z",
  full_name: "Utkarsh Dubey",
  id: "owner-a",
  role: "agency_owner",
};

test("marks the active CRM route and gives immediate navigation feedback", () => {
  const view = render(
    <WorkspaceShell actor={actor} area="agency">
      <p>Dashboard content</p>
    </WorkspaceShell>,
  );

  expect(view.container.firstElementChild).toHaveAttribute("data-area", "agency");
  expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  const click = new MouseEvent("click", { bubbles: true, cancelable: true });
  click.preventDefault();
  fireEvent(screen.getByRole("link", { name: "Clients" }), click);
  expect(screen.getByRole("status")).toHaveTextContent("Loading...");
});

test("opens and dismisses an accessible responsive navigation drawer", () => {
  render(
    <WorkspaceShell actor={actor} area="agency">
      <p>Dashboard content</p>
    </WorkspaceShell>,
  );

  const toggle = screen.getByRole("button", { name: "Open navigation" });
  const sidebar = screen.getByRole("complementary");

  expect(toggle).toHaveAttribute("aria-controls", "workspace-navigation");
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(sidebar).toHaveAttribute("data-open", "false");

  fireEvent.click(toggle);

  expect(screen.getByRole("button", { name: "Close navigation" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(sidebar).toHaveAttribute("data-open", "true");

  fireEvent.click(screen.getByRole("button", { name: "Dismiss navigation" }));

  expect(screen.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(sidebar).toHaveAttribute("data-open", "false");
});
