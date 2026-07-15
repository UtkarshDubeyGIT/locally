import { describe, expect, it } from "vitest";
import { integrationLimit, isQuotaAvailable } from "@/domain/quotas";

describe("integration quotas", () => {
  it("uses the agreed daily caps", () => {
    expect(integrationLimit("openai")).toBe(20);
    expect(integrationLimit("places")).toBe(30);
    expect(integrationLimit("pagespeed")).toBe(10);
    expect(integrationLimit("email")).toBe(10);
  });

  it("blocks a call when the cap is reached", () => {
    expect(isQuotaAvailable("openai", 19)).toBe(true);
    expect(isQuotaAvailable("openai", 20)).toBe(false);
  });
});
