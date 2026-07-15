import { render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAgencyOverview: vi.fn(),
}));

vi.mock("@/lib/data", () => ({
  getAgencyOverview: mocks.getAgencyOverview,
}));

import AgencyHome from "@/app/agency/page";

beforeEach(() => {
  mocks.getAgencyOverview.mockResolvedValue({
    clients: [
      {
        id: "client-a",
        business_name: "Madhur Sweets",
        industry: "Indian sweets",
        status: "active",
        is_demo: true,
      },
      {
        id: "client-b",
        business_name: "Anand Bakery",
        industry: "Bakery",
        status: "onboarding",
        is_demo: false,
      },
    ],
    locations: [
      { id: "location-a", client_id: "client-a", name: "Dwarka", status: "active" },
      { id: "location-b", client_id: "client-a", name: "Rohini", status: "active" },
      { id: "location-c", client_id: "client-b", name: "Karol Bagh", status: "draft" },
    ],
    reviews: [
      {
        id: "review-a",
        status: "awaiting_approval",
        severity: "high",
        rating: 2,
        review_date: "2026-07-15",
        location_id: "location-a",
      },
    ],
    actions: [
      {
        id: "action-a",
        client_id: "client-a",
        title: "Verify festive opening hours",
        status: "open",
        priority: "high",
        due_date: "2026-07-16",
      },
    ],
    reports: [
      {
        id: "report-a",
        client_id: "client-a",
        status: "awaiting_owner_approval",
        month: "2026-07-01",
      },
    ],
  });
});

test("presents the agency overview as a compact CRM workspace", async () => {
  const view = render(await AgencyHome());

  expect(screen.getByRole("heading", { level: 1, name: "Agency overview" })).toBeVisible();
  expect(screen.getByRole("region", { name: "Portfolio metrics" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Needs attention" })).toBeVisible();
  expect(screen.getByText("Verify festive opening hours")).toBeVisible();

  const portfolio = screen.getByRole("table", { name: "Client portfolio" });
  expect(within(portfolio).getByText("Madhur Sweets")).toBeVisible();
  expect(within(portfolio).getByText("Anand Bakery")).toBeVisible();
  expect(within(portfolio).getByRole("columnheader", { name: "Branches" })).toBeVisible();
  expect(within(portfolio).getByRole("columnheader", { name: "Reply queue" })).toBeVisible();
  expect(screen.queryByText(/good morning/i)).not.toBeInTheDocument();
  expect(view.container.querySelector(".seal")).toBeNull();
  expect(view.container.querySelector(".section__number")).toBeNull();
  expect(screen.queryByText("Your client book")).not.toBeInTheDocument();
});
