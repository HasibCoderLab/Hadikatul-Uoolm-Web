import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
      message: "DATABASE_URL must be a PostgreSQL connection string",
    })
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  return envSchema.parse(source);
}

export const env: Env = parseEnv(process.env);

export function requireDatabaseUrl(): string {
  const parsed = envSchema.shape.DATABASE_URL.safeParse(env.DATABASE_URL);
  if (!parsed.success || parsed.data === undefined) {
    throw new Error(
      "DATABASE_URL is required for database access. Copy .env.example to .env and provide a PostgreSQL URL.",
    );
  }
  return parsed.data;
}
