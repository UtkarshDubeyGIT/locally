export type IntegrationKind = "openai" | "places" | "pagespeed" | "email";

const limits: Record<IntegrationKind, number> = {
  openai: 20,
  places: 30,
  pagespeed: 10,
  email: 10,
};

export function integrationLimit(kind: IntegrationKind) {
  return limits[kind];
}

export function isQuotaAvailable(kind: IntegrationKind, used: number) {
  return used < integrationLimit(kind);
}
