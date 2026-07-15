export const formatDate = (value: string | Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", options ?? { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export const titleCase = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const sourceLabel: Record<string, string> = {
  live_api: "Live API", manual: "Manual", mock_gbp: "Mock GBP", demo_data: "Demo data",
};
