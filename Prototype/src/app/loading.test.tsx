import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import AgencyLoading from "@/app/agency/loading";
import ClientLoading from "@/app/client/loading";
import RootLoading from "@/app/loading";

afterEach(cleanup);

test.each([
  ["application", RootLoading],
  ["agency workspace", AgencyLoading],
  ["client workspace", ClientLoading],
])("shows a visible Loading... indicator for the %s", (_label, LoadingView) => {
  render(<LoadingView />);

  const status = screen.getByRole("status");
  expect(status).toHaveAttribute("aria-busy", "true");
  expect(status).toHaveTextContent(/^Loading\.\.\./);
});
