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

test("keeps the landing hero as the only oversized editorial heading", () => {
  expect(rule(globals, "h1, h2, .display")).toMatch(/font-weight:\s*500/);
  expect(rule(globals, "h1")).toMatch(
    /font-size:\s*clamp\(2\.6rem,\s*5vw,\s*5rem\)/,
  );
  expect(rule(globals, "h2")).toMatch(
    /font-size:\s*clamp\(1\.8rem,\s*3vw,\s*3rem\)/,
  );
  expect(rule(globals, ".page-head h1")).toMatch(
    /font-size:\s*clamp\(2rem,\s*3\.1vw,\s*3\.2rem\)/,
  );
  expect(rule(globals, ".empty h3")).toMatch(/font-size:\s*1\.7rem/);

  const heroTitle = rule(landing, ".heroTitle");
  expect(heroTitle).toMatch(
    /font-size:\s*clamp\(4rem,\s*8\.5vw,\s*8\.2rem\)/,
  );
  expect(heroTitle).toMatch(/font-weight:\s*600/);
  expect(rule(landing, ".sectionTitle")).toMatch(
    /font-size:\s*clamp\(2\.5rem,\s*4\.8vw,\s*4\.5rem\)/,
  );
  expect(rule(landing, ".closingTitle")).toMatch(
    /font-size:\s*clamp\(2\.3rem,\s*4\.5vw,\s*4rem\)/,
  );
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

test("constrains the sign-in artwork to a responsive portrait frame", () => {
  const login = rule(globals, ".login");
  expect(login).toMatch(/max-width:\s*1320px/);
  expect(login).toMatch(
    /grid-template-columns:\s*minmax\(0,\s*0\.9fr\)\s*minmax\(390px,\s*1\.1fr\)/,
  );

  const visual = rule(globals, ".login__visual");
  expect(visual).toMatch(/place-items:\s*center/);

  const artwork = rule(globals, ".login__visual .hero");
  expect(artwork).toMatch(/width:\s*min\(100%,\s*680px\)/);
  expect(artwork).toMatch(/aspect-ratio:\s*6\s*\/\s*5/);
  expect(artwork).toMatch(/min-height:\s*0/);

  const tablet = globals.slice(
    globals.indexOf("@media (max-width: 900px)"),
    globals.indexOf("@media (max-width: 640px)"),
  );
  expect(rule(tablet, ".login__visual .hero")).toMatch(
    /width:\s*min\(100%,\s*680px\)/,
  );
  expect(rule(tablet, ".login__visual .hero")).toMatch(
    /height:\s*clamp\(280px,\s*42svh,\s*420px\)/,
  );

  const mobile = globals.slice(
    globals.indexOf("@media (max-width: 640px)"),
    globals.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  expect(rule(mobile, ".login__visual .hero")).toMatch(
    /height:\s*clamp\(240px,\s*34svh,\s*300px\)/,
  );
});
