import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const repositoryRoot = resolve(process.cwd(), "..");

function readRepositoryFile(path: string) {
  try {
    return readFileSync(resolve(repositoryRoot, path), "utf8");
  } catch {
    return "";
  }
}

describe("Supabase keep-alive automation", () => {
  test("exposes only a harmless keepalive RPC to the anonymous role", () => {
    const migrationsDirectory = resolve(
      repositoryRoot,
      "Prototype/supabase/migrations",
    );
    const migrationName = readdirSync(migrationsDirectory).find((name) =>
      name.endsWith("_add_supabase_keepalive_rpc.sql"),
    );
    const migration = migrationName
      ? readFileSync(resolve(migrationsDirectory, migrationName), "utf8")
      : "";

    expect(migration).toMatch(
      /create or replace function public\.keepalive\(\)\s+returns boolean/i,
    );
    expect(migration).toMatch(/security invoker/i);
    expect(migration).toMatch(/set search_path = ''/i);
    expect(migration).toMatch(
      /revoke all on function public\.keepalive\(\) from public/i,
    );
    expect(migration).toMatch(
      /grant execute on function public\.keepalive\(\) to anon/i,
    );
  });

  test("runs a verified database query four times daily without an admin key", () => {
    const workflow = readRepositoryFile(
      ".github/workflows/supabase-keep-alive.yml",
    );

    expect(workflow).toContain('cron: "17 */6 * * *"');
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("permissions: {}");
    expect(workflow).toContain("secrets.NEXT_PUBLIC_SUPABASE_URL");
    expect(workflow).toContain(
      "secrets.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
    expect(workflow).toContain("/rest/v1/rpc/keepalive");
    expect(workflow).toContain("--fail-with-body");
    expect(workflow).toContain('test "$response" = "true"');
    expect(workflow).not.toContain("SUPABASE_SECRET_KEY");
  });
});
