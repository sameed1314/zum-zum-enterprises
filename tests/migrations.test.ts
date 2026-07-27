import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "src/migrations/20260725_161639.ts",
);
const projectsCollectionPath = path.join(
  process.cwd(),
  "src/collections/Projects.ts",
);

describe("PostgreSQL schema", () => {
  it("keeps the project lifecycle enum separate from Payload draft status", () => {
    const projectsCollection = readFileSync(projectsCollectionPath, "utf8");
    const migration = readFileSync(migrationPath, "utf8");

    expect(projectsCollection).toContain(
      'enumName: "enum_projects_project_status"',
    );
    expect(migration).toContain(
      `"enum_projects_project_status" AS ENUM('ongoing', 'completed', 'upcoming')`,
    );
    expect(migration).toContain(
      `"status" "enum_projects_project_status" DEFAULT 'completed'`,
    );
    expect(migration).toContain(
      `"version_status" "enum_projects_project_status" DEFAULT 'completed'`,
    );
    expect(migration).toContain(
      `"_status" "enum_projects_status" DEFAULT 'draft'`,
    );
    expect(migration).toContain(
      `"version__status" "enum__projects_v_version_status" DEFAULT 'draft'`,
    );
  });
});
