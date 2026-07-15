import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const globals = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);
const landing = readFileSync(
  join(process.cwd(), "src/app/landing.module.css"),
  "utf8",
);

function rule(css: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1];
}

test("reserves editorial type for the brand and landing hero", () => {
  expect(rule(globals, "h1, h2, h3")).toMatch(/font-family:\s*var\(--body\)/);
  expect(rule(globals, "h1, h2, h3")).toMatch(/font-style:\s*normal/);
  expect(rule(globals, "h1")).toMatch(
    /font-size:\s*clamp\(2rem,\s*4vw,\s*3\.75rem\)/,
  );
  expect(rule(globals, "h2")).toMatch(
    /font-size:\s*clamp\(1\.45rem,\s*2\.4vw,\s*2\.25rem\)/,
  );
  expect(rule(globals, ".page-head h1")).toMatch(
    /font-size:\s*clamp\(1\.75rem,\s*2\.5vw,\s*2\.6rem\)/,
  );
  expect(rule(globals, ".page-head h1")).toMatch(/font-style:\s*normal/);
  expect(rule(globals, ".empty h3")).toMatch(/font-size:\s*1\.1rem/);

  const heroTitle = rule(landing, ".heroTitle");
  expect(heroTitle).toMatch(
    /font-size:\s*clamp\(3\.5rem,\s*7\.5vw,\s*7rem\)/,
  );
  expect(heroTitle).toMatch(/font-family:\s*var\(--display\)/);
  expect(heroTitle).toMatch(/line-height:\s*1\.02/);
  expect(heroTitle).toMatch(/font-weight:\s*600/);
  expect(rule(landing, ".sectionTitle")).toMatch(
    /font-size:\s*clamp\(2rem,\s*4vw,\s*3\.6rem\)/,
  );
  expect(rule(landing, ".closingTitle")).toMatch(
    /font-size:\s*clamp\(1\.8rem,\s*3\.2vw,\s*3rem\)/,
  );
});

test("uses accessible, deliberate product controls", () => {
  expect(globals).toContain("--muted: #67655f");
  expect(rule(globals, ":focus-visible")).toMatch(
    /outline:\s*2px solid var\(--ink\)/,
  );
  expect(rule(globals, ":focus-visible")).toMatch(
    /box-shadow:\s*0 0 0 4px var\(--accent\)/,
  );
  expect(rule(globals, ".button")).toMatch(/min-height:\s*44px/);
  expect(rule(globals, ".button")).toMatch(/border-radius:\s*10px/);
  expect(rule(globals, ".field::placeholder")).toMatch(/color:\s*#6f6d67/);
});

test("uses compact CRM spacing and a Phase 1 inspired agency shell", () => {
  expect(rule(globals, ".main")).toMatch(/width:\s*min\(1480px,\s*100%\)/);
  expect(rule(globals, ".page-head")).toMatch(/margin-bottom:\s*1\.5rem/);
  expect(rule(globals, ".section")).toMatch(/margin-top:\s*2\.25rem/);
  expect(rule(globals, '.shell[data-area="agency"] .sidebar')).toMatch(
    /background:\s*var\(--ink\)/,
  );
  expect(rule(globals, ".crm-metrics")).toMatch(
    /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/,
  );
  expect(rule(globals, ".crm-dashboard-grid")).toMatch(
    /grid-template-columns:\s*minmax\(0,\s*1\.65fr\)\s*minmax\(280px,\s*\.75fr\)/,
  );
  expect(rule(globals, ".loading-indicator")).toMatch(
    /animation:\s*loading-pulse\s*1\.1s\s*ease-in-out\s*infinite/,
  );
});

test("uses low-contrast surfaces and mobile-safe work rows", () => {
  expect(rule(globals, ".card")).toMatch(/border:\s*0/);
  expect(rule(globals, ".card")).toMatch(/background:\s*var\(--surface\)/);
  expect(rule(globals, ".list-row--split")).toMatch(
    /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*auto/,
  );

  const mobile = globals.slice(
    globals.indexOf("@media (max-width: 640px)"),
    globals.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  expect(rule(mobile, ".list-row--split")).toMatch(
    /grid-template-columns:\s*1fr/,
  );
  expect(rule(mobile, ".topnav .badge")).toMatch(/display:\s*none/);
  expect(rule(mobile, ".navigation-status")).toMatch(/position:\s*fixed/);
  expect(rule(mobile, ".form-actions")).toMatch(/flex-direction:\s*column/);
});

test("keeps the desktop rail stable and converts it to a mobile drawer", () => {
  expect(rule(globals, ".workspace")).toMatch(/align-items:\s*start/);

  const sidebar = rule(globals, ".sidebar");
  expect(sidebar).toMatch(/position:\s*sticky/);
  expect(sidebar).toMatch(/top:\s*66px/);
  expect(sidebar).toMatch(/height:\s*calc\(100dvh\s*-\s*66px\)/);
  expect(sidebar).toMatch(/display:\s*flex/);
  expect(sidebar).toMatch(/flex-direction:\s*column/);

  expect(rule(globals, ".sidebar nav")).toMatch(/position:\s*static/);
  expect(rule(globals, ".sidebar__footer")).toMatch(/margin-top:\s*auto/);

  const tablet = globals.slice(
    globals.indexOf("@media (max-width: 900px)"),
    globals.indexOf("@media (max-width: 640px)"),
  );
  expect(rule(tablet, ".sidebar")).toMatch(/position:\s*fixed/);
  expect(rule(tablet, ".sidebar")).toMatch(/transform:\s*translateX\(-105%\)/);
  expect(rule(tablet, ".sidebar")).toMatch(/visibility:\s*hidden/);
  expect(rule(tablet, '.sidebar[data-open="true"]')).toMatch(
    /transform:\s*translateX\(0\)/,
  );
  expect(rule(tablet, '.sidebar[data-open="true"]')).toMatch(
    /visibility:\s*visible/,
  );
  expect(rule(tablet, ".nav-toggle")).toMatch(/display:\s*inline-grid/);
  expect(rule(tablet, ".nav-scrim")).toMatch(/position:\s*fixed/);
});

test("constrains the sign-in artwork to a responsive portrait frame", () => {
  const login = rule(globals, ".login");
  expect(login).toMatch(/max-width:\s*1320px/);
  expect(login).toMatch(
    /grid-template-columns:\s*minmax\(0,\s*0\.9fr\)\s*minmax\(390px,\s*1\.1fr\)/,
  );

  const visual = rule(globals, ".login__visual");
  expect(visual).toMatch(/place-items:\s*center/);

  const artwork = rule(globals, ".login__visual .hero");
  expect(artwork).toMatch(/width:\s*min\(100%,\s*560px\)/);
  expect(artwork).toMatch(/aspect-ratio:\s*4\s*\/\s*5/);
  expect(artwork).toMatch(/min-height:\s*0/);

  const tablet = globals.slice(
    globals.indexOf("@media (max-width: 900px)"),
    globals.indexOf("@media (max-width: 640px)"),
  );
  expect(rule(tablet, ".login__visual .hero")).toMatch(
    /width:\s*min\(100%,\s*560px\)/,
  );
  expect(rule(tablet, ".login__visual .hero")).toMatch(
    /height:\s*clamp\(220px,\s*32svh,\s*320px\)/,
  );

  const mobile = globals.slice(
    globals.indexOf("@media (max-width: 640px)"),
    globals.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  expect(rule(mobile, ".login__visual .hero")).toMatch(
    /height:\s*clamp\(160px,\s*24svh,\s*190px\)/,
  );
});

test("turns the visual report into a clean printable document", () => {
  const print = globals.slice(globals.indexOf("@media print"));

  expect(print).toContain("@media print");
  expect(
    rule(
      print,
      ".topbar, .sidebar, .nav-scrim, .print-report-button, .report-feedback",
    ),
  ).toMatch(/display:\s*none\s*!important/);
  expect(rule(print, ".workspace")).toMatch(/display:\s*block/);
  expect(rule(print, ".main")).toMatch(/width:\s*100%/);
  expect(
    rule(
      print,
      ".report-growth-board, .report-narrative, .report-branch-chart",
    ),
  ).toMatch(/break-inside:\s*avoid/);
  expect(rule(print, "body")).toMatch(/print-color-adjust:\s*exact/);
});
