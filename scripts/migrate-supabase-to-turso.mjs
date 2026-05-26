import { readFileSync } from "fs";
import path from "path";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createTursoClient } from "@libsql/client";

function requireEnv(name, allowEmpty = false) {
  const value = process.env[name] ?? "";
  if (!allowEmpty && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
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

async function fetchLiveDashboardSnapshot() {
  const baseUrl = process.env.PUBLIC_SITE_URL || "https://prosperityklub.com";
  const username = requireEnv("ADMIN_USERNAME");
  const password = requireEnv("ADMIN_PASSWORD");

  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    throw new Error(`Live admin login failed with status ${loginRes.status}`);
  }

  const cookieHeader = loginRes.headers.get("set-cookie");
  if (!cookieHeader) {
    throw new Error("Live admin login did not return a session cookie");
  }

  const dashboardRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!dashboardRes.ok) {
    throw new Error(`Live dashboard fetch failed with status ${dashboardRes.status}`);
  }

  return dashboardRes.json();
}

async function main() {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const tursoUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
  const tursoToken = process.env.TURSO_AUTH_TOKEN || undefined;

  const supabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const turso = createTursoClient({
    url: tursoUrl,
    authToken: tursoUrl.startsWith("file:") ? undefined : tursoToken,
  });

  await turso.batch(loadSchemaStatements(), "write");

  let leads = [];
  let ebookRequests = [];
  let fullAccessRegistrations = [];
  let iponChallengeRegistrations = [];
  let sourceLabel = "Supabase";

  try {
    const [
      leadsRes,
      ebookRes,
      fullAccessRes,
      iponRes,
    ] = await Promise.all([
      supabase.from("leads").select("*"),
      supabase.from("ebook_requests").select("*"),
      supabase.from("full_access_registrations").select("*"),
      supabase.from("ipon_challenge_registrations").select("*"),
    ]);

    const firstError = [leadsRes, ebookRes, fullAccessRes, iponRes].find((result) => result.error)?.error;
    if (firstError) {
      throw new Error(firstError.message);
    }

    leads = leadsRes.data ?? [];
    ebookRequests = ebookRes.data ?? [];
    fullAccessRegistrations = fullAccessRes.data ?? [];
    iponChallengeRegistrations = iponRes.data ?? [];
  } catch (error) {
    try {
      const liveData = await fetchLiveDashboardSnapshot();
      leads = liveData.leads ?? [];
      ebookRequests = liveData.ebook_requests ?? [];
      fullAccessRegistrations = liveData.full_access_registrations ?? [];
      iponChallengeRegistrations = liveData.ipon_challenge_registrations ?? [];
      sourceLabel = "live deployed dashboard fallback";
      console.warn(`Supabase export failed, using ${sourceLabel}: ${error.message}`);
    } catch (liveError) {
      sourceLabel = "empty schema fallback";
      console.warn(`Supabase export failed: ${error.message}`);
      console.warn(`Live dashboard fallback failed: ${liveError.message}`);
      console.warn("Continuing with an empty Turso database.");
    }
  }

  await turso.batch(
    [
      { sql: "DELETE FROM leads" },
      { sql: "DELETE FROM ebook_requests" },
      { sql: "DELETE FROM full_access_registrations" },
      { sql: "DELETE FROM ipon_challenge_registrations" },
    ],
    "write"
  );

  const statements = [
    ...leads.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO leads (
          id, reference_id, name, email, phone, location, is_ofw, income_range,
          priorities, tags, is_qualified, source_page, requested_resource,
          recommended_follow_up, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        row.id,
        row.reference_id,
        row.name,
        row.email,
        row.phone,
        row.location,
        row.is_ofw === null || row.is_ofw === undefined ? null : row.is_ofw ? 1 : 0,
        row.income_range,
        JSON.stringify(row.priorities ?? []),
        JSON.stringify(row.tags ?? []),
        row.is_qualified ? 1 : 0,
        row.source_page,
        row.requested_resource,
        row.recommended_follow_up,
        row.status ?? "new",
        JSON.stringify(row.notes ?? {}),
        row.created_at,
      ],
    })),
    ...ebookRequests.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO ebook_requests (
          id, name, email, source_page, requested_resource, status,
          delivery_method, sent_at, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        row.id,
        row.name,
        row.email,
        row.source_page,
        row.requested_resource,
        row.status ?? "pending",
        row.delivery_method ?? "email",
        row.sent_at,
        JSON.stringify(row.notes ?? {}),
        row.created_at,
      ],
    })),
    ...fullAccessRegistrations.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO full_access_registrations (
          id, reference_id, source_page, first_name, middle_name, last_name, gender,
          gender_other, civil_status, civil_status_other, date_of_birth,
          place_of_birth, age, weight, height, citizenship, email, mobile,
          consent, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        row.id,
        row.reference_id,
        row.source_page,
        row.first_name,
        row.middle_name,
        row.last_name,
        row.gender,
        row.gender_other,
        row.civil_status,
        row.civil_status_other,
        row.date_of_birth,
        row.place_of_birth,
        row.age,
        row.weight,
        row.height,
        row.citizenship,
        row.email,
        row.mobile,
        row.consent ? 1 : 0,
        row.status ?? "new",
        JSON.stringify(row.notes ?? {}),
        row.created_at,
      ],
    })),
    ...iponChallengeRegistrations.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO ipon_challenge_registrations (
          id, reference_id, source_page, first_name, middle_name, last_name, gender,
          gender_other, civil_status, civil_status_other, date_of_birth,
          place_of_birth, age, weight, height, citizenship, email, mobile,
          consent, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        row.id,
        row.reference_id,
        row.source_page,
        row.first_name,
        row.middle_name,
        row.last_name,
        row.gender,
        row.gender_other,
        row.civil_status,
        row.civil_status_other,
        row.date_of_birth,
        row.place_of_birth,
        row.age,
        row.weight,
        row.height,
        row.citizenship,
        row.email,
        row.mobile,
        row.consent ? 1 : 0,
        row.status ?? "new",
        JSON.stringify(row.notes ?? {}),
        row.created_at,
      ],
    })),
  ];

  if (statements.length > 0) {
    await turso.batch(statements, "write");
  }

  console.log(`Migrated ${leads.length} leads`);
  console.log(`Migrated ${ebookRequests.length} ebook requests`);
  console.log(`Migrated ${fullAccessRegistrations.length} full access registrations`);
  console.log(`Migrated ${iponChallengeRegistrations.length} Ipon Challenge registrations`);
  console.log(`Target database: ${tursoUrl}`);
  console.log(`Source: ${sourceLabel}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
