import { describe, expect, it } from "vitest";
import { envSchema, parseEnv } from "./env";

describe("env schema", () => {
  it("accepts a valid PostgreSQL URL", () => {
    const env = parseEnv({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });

    expect(env.NODE_ENV).toBe("production");
    expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
  });

  it("defaults NODE_ENV to development", () => {
    expect(parseEnv({}).NODE_ENV).toBe("development");
  });

  it("allows DATABASE_URL to be absent so builds do not need a database", () => {
    expect(parseEnv({}).DATABASE_URL).toBeUndefined();
  });

  it("rejects a non-PostgreSQL connection string", () => {
    expect(() => parseEnv({ DATABASE_URL: "mysql://localhost:3306/db" })).toThrow(
      /PostgreSQL connection string/,
    );
  });

  it("rejects an unknown NODE_ENV", () => {
    expect(() => parseEnv({ NODE_ENV: "staging" })).toThrow();
    expect(envSchema.safeParse({ NODE_ENV: "staging" }).success).toBe(false);
  });
});
