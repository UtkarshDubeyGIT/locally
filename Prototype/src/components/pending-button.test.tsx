import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { PendingButton } from "@/components/pending-button";

test("shows an accessible working state while its form action is pending", async () => {
  let finish!: () => void;
  const action = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );

  render(
    <form action={action}>
      <PendingButton pendingLabel="Drafting a safe reply…">
        Generate with AI
      </PendingButton>
    </form>,
  );

  fireEvent.submit(screen.getByRole("button").closest("form")!);

  const pendingButton = await screen.findByRole("button", {
    name: "Drafting a safe reply…",
  });
  expect(pendingButton).toBeDisabled();
  expect(pendingButton).toHaveAttribute("aria-busy", "true");

  finish();
});

test("renders its normal label before submission", () => {
  render(
    <form>
      <PendingButton pendingLabel="Saving…">Save changes</PendingButton>
    </form>,
  );

  expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
});
