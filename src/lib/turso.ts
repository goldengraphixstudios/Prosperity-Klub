import "server-only";

import { readFileSync } from "fs";
import path from "path";

import { createClient, type Client, type InStatement, type Row } from "@libsql/client";

let schemaReady: Promise<void> | null = null;

function getDatabaseUrl() {
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }

  if (process.env.NODE_ENV !== "production") {
    return "file:local.db";
  }

  return "";
}

export function getTursoClient(): Client | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  const isLocalFile = url.startsWith("file:");
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!isLocalFile && !authToken) {
    return null;
  }

  return createClient({
    url,
    authToken: isLocalFile ? undefined : authToken,
  });
}

function loadSchemaStatements() {
  const schemaPath = path.join(process.cwd(), "turso", "sql", "init.sql");
  const schema = readFileSync(schemaPath, "utf8");

  return schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((sql) => ({ sql }));
}

export async function ensureTursoSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = getTursoClient();
      if (!client) {
        throw new Error(
          "Turso configuration missing. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
        );
      }

      await client.batch(loadSchemaStatements(), "write");
    })();
  }

  return schemaReady;
}

export async function executeTurso(statement: InStatement) {
  const client = getTursoClient();
  if (!client) {
    throw new Error(
      "Turso configuration missing. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
    );
  }

  await ensureTursoSchema();
  return client.execute(statement);
}

export async function batchTurso(statements: InStatement[]) {
  const client = getTursoClient();
  if (!client) {
    throw new Error(
      "Turso configuration missing. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
    );
  }

  await ensureTursoSchema();
  return client.batch(statements, "write");
}

export function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function serializeJsonValue(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function normalizeIntegerBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "bigint") return Number(value) === 1;
  if (typeof value === "string") {
    return value === "1" || value.toLowerCase() === "true";
  }
  return false;
}

export function rowToRecord(row: Row) {
  return Object.fromEntries(Object.entries(row));
}
