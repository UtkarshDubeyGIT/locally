import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { ReportView } from "@/components/report-view";

afterEach(cleanup);

const metrics = {
  reviewsReceived: 18,
  reviewsReplied: 16,
  averageRating: 4.3,
  ratingChange: 0.2,
  websiteAuditScore: 61,
  openActions: 3,
  completedActions: 2,
  branchComparison: [
    { location: "Dwarka", averageRating: 4.6 },
    { location: "Noida Sector 18", averageRating: 3.7 },
  ],
};

test("turns the stored snapshot into directly labelled growth charts", () => {
  render(<ReportView metrics={metrics} summary="Rating recovery is moving." />);

  expect(
    screen.getByRole("img", {
      name: "Average rating improved from 4.1 to 4.3 stars this month",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "89% of reviews received a reply" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "40% of actions are complete" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Website audit score is 61 out of 100",
    }),
  ).toBeVisible();

  const branches = screen.getByRole("region", { name: "Branch rating comparison" });
  expect(within(branches).getByText("Dwarka")).toBeVisible();
  expect(within(branches).getByText("4.6")).toBeVisible();
  expect(within(branches).getByText("Noida Sector 18")).toBeVisible();
  expect(within(branches).getByText("3.7")).toBeVisible();
});

test("uses safe zero percentages when a report has no activity", () => {
  render(
    <ReportView
      metrics={{
        reviewsReceived: 0,
        reviewsReplied: 0,
        averageRating: 0,
        ratingChange: 0,
        websiteAuditScore: 0,
        openActions: 0,
        completedActions: 0,
      }}
      summary={null}
    />,
  );

  expect(
    screen.getByRole("img", { name: "0% of reviews received a reply" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "0% of actions are complete" }),
  ).toBeVisible();
  expect(screen.queryByText(/NaN|Infinity/)).not.toBeInTheDocument();
});
