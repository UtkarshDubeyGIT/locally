import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : /\.(ts|tsx)$/.test(name) && !name.includes(".test.")
        ? [path]
        : [];
  });
}

test("keeps visible interface copy free of typographic dash flourishes", () => {
  const roots = [join(process.cwd(), "src/app"), join(process.cwd(), "src/components")];
  const offenders = roots.flatMap(sourceFiles).flatMap((path) => {
    const content = readFileSync(path, "utf8");
    return /[\u2014\u2013]/.test(content)
      ? [path.replace(`${process.cwd()}/`, "")]
      : [];
  });

  expect(offenders).toEqual([]);
});

test("keeps decorative section numbers out of product pages", () => {
  const roots = [join(process.cwd(), "src/app"), join(process.cwd(), "src/components")];
  const source = roots
    .flatMap(sourceFiles)
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  expect(source).not.toMatch(/<Section\s+number=/);
  expect(source).not.toContain('className="section__number"');
});

test("uses the installed icon library for product controls", () => {
  const controls = [
    join(process.cwd(), "src/components/workspace-shell.tsx"),
    join(process.cwd(), "src/components/print-report-button.tsx"),
  ]
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  expect(controls).toContain('from "lucide-react"');
  expect(controls).not.toContain("<svg");
});
