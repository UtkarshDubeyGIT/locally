import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { emailDeliveryKinds } from "./email-deliveries";

describe("email delivery kinds", () => {
  it("uses values accepted by the database constraint", () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        "supabase/migrations/20260715092447_locally_foundation.sql",
      ),
      "utf8",
    );
    const constraint = migration.match(
      /kind text not null check \(kind in \(([^)]+)\)\)/,
    );

    expect(constraint).not.toBeNull();
    const acceptedKinds = constraint![1]
      .split(",")
      .map((value) => value.trim().replaceAll("'", ""));

    expect(Object.values(emailDeliveryKinds)).toEqual(
      expect.arrayContaining(acceptedKinds),
    );
    expect(acceptedKinds).toEqual(
      expect.arrayContaining(Object.values(emailDeliveryKinds)),
    );
  });

  it("uses the shared values and checks delivery logging failures", () => {
    const clientsAction = readFileSync(
      join(process.cwd(), "src/app/actions/clients.ts"),
      "utf8",
    );
    const reportsAction = readFileSync(
      join(process.cwd(), "src/app/actions/reports.ts"),
      "utf8",
    );

    expect(clientsAction).toContain("kind:emailDeliveryKinds.onboarding");
    expect(reportsAction).toContain("kind:emailDeliveryKinds.monthlyUpdate");
    expect(`${clientsAction}\n${reportsAction}`).not.toMatch(
      /onboarding_invite|monthly_report/,
    );
    expect(reportsAction).toContain(
      'const {error:deliveryError}=await db.from("email_deliveries").insert',
    );
    expect(reportsAction).toContain("if(deliveryError)throw deliveryError;");
  });
});
