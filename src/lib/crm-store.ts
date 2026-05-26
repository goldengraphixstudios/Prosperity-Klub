import "server-only";

import {
  batchTurso,
  executeTurso,
  normalizeIntegerBoolean,
  parseJsonValue,
  rowToRecord,
  serializeJsonValue,
} from "@/lib/turso";

type DashboardRows = {
  leads: Array<Record<string, unknown>>;
  ebook_requests: Array<Record<string, unknown>>;
  full_access_registrations: Array<Record<string, unknown>>;
  ipon_challenge_registrations: Array<Record<string, unknown>>;
};

type DashboardCounts = {
  leads: number;
  ebook_requests: number;
  full_access_registrations: number;
  ipon_challenge_registrations: number;
};

export type DashboardTable =
  | "leads"
  | "ebook_requests"
  | "full_access_registrations"
  | "ipon_challenge_registrations";

type SqlValue = string | number | bigint | ArrayBuffer | Uint8Array | null;

function toCount(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function toSqlValue(value: unknown): SqlValue {
  if (value === null || value === undefined) return null;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint"
  ) {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
    return value;
  }
  return JSON.stringify(value);
}

function decodeLeadRow(row: Record<string, unknown>) {
  return {
    ...row,
    priorities: parseJsonValue<string[]>(row.priorities, []),
    tags: parseJsonValue<string[]>(row.tags, []),
    notes: parseJsonValue<Record<string, unknown>>(row.notes, {}),
    is_ofw:
      row.is_ofw === null || row.is_ofw === undefined
        ? null
        : normalizeIntegerBoolean(row.is_ofw),
    is_qualified: normalizeIntegerBoolean(row.is_qualified),
  };
}

function decodeEbookRow(row: Record<string, unknown>) {
  return {
    ...row,
    notes: parseJsonValue<Record<string, unknown>>(row.notes, {}),
  };
}

function decodeMembershipRow(row: Record<string, unknown>) {
  return {
    ...row,
    consent: normalizeIntegerBoolean(row.consent),
    notes: parseJsonValue<Record<string, unknown>>(row.notes, {}),
  };
}

async function countTable(table: string) {
  const result = await executeTurso(`SELECT COUNT(*) AS count FROM ${table}`);
  return toCount(result.rows[0]?.count);
}

async function listTable(table: string) {
  const result = await executeTurso(
    `SELECT * FROM ${table} ORDER BY datetime(created_at) DESC LIMIT 200`
  );
  return result.rows.map((row) => rowToRecord(row));
}

export async function deleteDashboardRecord(table: DashboardTable, id: string) {
  await executeTurso({
    sql: `DELETE FROM ${table} WHERE id = ?`,
    args: [id],
  });
}

export async function insertLead(input: {
  referenceId: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  isOfw: boolean | null;
  incomeRange: string | null;
  priorities: string[];
  tags: string[];
  qualified: boolean;
  sourcePage: string | null;
  requestedResource: string | null;
  recommendedFollowUp: string;
}) {
  await executeTurso({
    sql: `
      INSERT INTO leads (
        reference_id, name, email, phone, location, is_ofw, income_range,
        priorities, tags, is_qualified, source_page, requested_resource,
        recommended_follow_up, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      input.referenceId,
      input.name,
      input.email,
      input.phone,
      input.location,
      input.isOfw === null ? null : input.isOfw ? 1 : 0,
      input.incomeRange,
      serializeJsonValue(input.priorities),
      serializeJsonValue(input.tags),
      input.qualified ? 1 : 0,
      input.sourcePage,
      input.requestedResource,
      input.recommendedFollowUp,
      "new",
      serializeJsonValue({}),
    ],
  });
}

export async function insertEbookRequest(input: {
  name: string;
  email: string;
  sourcePage: string;
  requestedResource: string;
  status: "pending" | "sent" | "failed" | "manual" | "delivered";
  deliveryMethod: string;
  notes?: Record<string, unknown>;
}) {
  await executeTurso({
    sql: `
      INSERT INTO ebook_requests (
        name, email, source_page, requested_resource, status, delivery_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      input.name,
      input.email,
      input.sourcePage,
      input.requestedResource,
      input.status,
      input.deliveryMethod,
      serializeJsonValue(input.notes ?? {}),
    ],
  });
}

export async function insertMembershipRegistration(
  table: "full_access_registrations" | "ipon_challenge_registrations",
  input: {
    referenceId: string;
    sourcePage: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    genderOther: string | null;
    civilStatus: string;
    civilStatusOther: string | null;
    dateOfBirth: string;
    placeOfBirth: string;
    age: number;
    weight: string;
    height: string;
    citizenship: string;
    email: string;
    mobile: string | null;
    consent: boolean;
    notes: Record<string, unknown>;
  }
) {
  await executeTurso({
    sql: `
      INSERT INTO ${table} (
        reference_id, source_page, first_name, middle_name, last_name, gender,
        gender_other, civil_status, civil_status_other, date_of_birth,
        place_of_birth, age, weight, height, citizenship, email, mobile,
        consent, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      input.referenceId,
      input.sourcePage,
      input.firstName,
      input.middleName,
      input.lastName,
      input.gender,
      input.genderOther,
      input.civilStatus,
      input.civilStatusOther,
      input.dateOfBirth,
      input.placeOfBirth,
      input.age,
      input.weight,
      input.height,
      input.citizenship,
      input.email,
      input.mobile,
      input.consent ? 1 : 0,
      "new",
      serializeJsonValue(input.notes),
    ],
  });
}

export async function getDashboardData(): Promise<{
  counts: DashboardCounts;
} & DashboardRows> {
  const [
    leadsCount,
    ebookCount,
    fullAccessCount,
    iponCount,
    leadsRows,
    ebookRows,
    fullAccessRows,
    iponRows,
  ] = await Promise.all([
    countTable("leads"),
    countTable("ebook_requests"),
    countTable("full_access_registrations"),
    countTable("ipon_challenge_registrations"),
    listTable("leads"),
    listTable("ebook_requests"),
    listTable("full_access_registrations"),
    listTable("ipon_challenge_registrations"),
  ]);

  return {
    counts: {
      leads: leadsCount,
      ebook_requests: ebookCount,
      full_access_registrations: fullAccessCount,
      ipon_challenge_registrations: iponCount,
    },
    leads: leadsRows.map(decodeLeadRow),
    ebook_requests: ebookRows.map(decodeEbookRow),
    full_access_registrations: fullAccessRows.map(decodeMembershipRow),
    ipon_challenge_registrations: iponRows.map(decodeMembershipRow),
  };
}

export async function resetAndImportData(input: {
  leads: Array<Record<string, unknown>>;
  ebookRequests: Array<Record<string, unknown>>;
  fullAccessRegistrations: Array<Record<string, unknown>>;
  iponChallengeRegistrations: Array<Record<string, unknown>>;
}) {
  await batchTurso([
    { sql: "DELETE FROM leads" },
    { sql: "DELETE FROM ebook_requests" },
    { sql: "DELETE FROM full_access_registrations" },
    { sql: "DELETE FROM ipon_challenge_registrations" },
  ]);

  const statements = [
    ...input.leads.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO leads (
          id, reference_id, name, email, phone, location, is_ofw, income_range,
          priorities, tags, is_qualified, source_page, requested_resource,
          recommended_follow_up, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        toSqlValue(row.id),
        toSqlValue(row.reference_id),
        toSqlValue(row.name),
        toSqlValue(row.email),
        toSqlValue(row.phone),
        toSqlValue(row.location),
        row.is_ofw === null || row.is_ofw === undefined ? null : row.is_ofw ? 1 : 0,
        toSqlValue(row.income_range),
        serializeJsonValue(row.priorities ?? []),
        serializeJsonValue(row.tags ?? []),
        row.is_qualified ? 1 : 0,
        toSqlValue(row.source_page),
        toSqlValue(row.requested_resource),
        toSqlValue(row.recommended_follow_up),
        toSqlValue(row.status ?? "new"),
        serializeJsonValue(row.notes ?? {}),
        toSqlValue(row.created_at),
      ] as SqlValue[],
    })),
    ...input.ebookRequests.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO ebook_requests (
          id, name, email, source_page, requested_resource, status,
          delivery_method, sent_at, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        toSqlValue(row.id),
        toSqlValue(row.name),
        toSqlValue(row.email),
        toSqlValue(row.source_page ?? "/resources"),
        toSqlValue(row.requested_resource),
        toSqlValue(row.status ?? "pending"),
        toSqlValue(row.delivery_method ?? "email"),
        toSqlValue(row.sent_at),
        serializeJsonValue(row.notes ?? {}),
        toSqlValue(row.created_at),
      ] as SqlValue[],
    })),
    ...input.fullAccessRegistrations.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO full_access_registrations (
          id, reference_id, source_page, first_name, middle_name, last_name, gender,
          gender_other, civil_status, civil_status_other, date_of_birth,
          place_of_birth, age, weight, height, citizenship, email, mobile,
          consent, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        toSqlValue(row.id),
        toSqlValue(row.reference_id),
        toSqlValue(row.source_page ?? "/membership"),
        toSqlValue(row.first_name),
        toSqlValue(row.middle_name),
        toSqlValue(row.last_name),
        toSqlValue(row.gender),
        toSqlValue(row.gender_other),
        toSqlValue(row.civil_status),
        toSqlValue(row.civil_status_other),
        toSqlValue(row.date_of_birth),
        toSqlValue(row.place_of_birth),
        toSqlValue(row.age ?? 0),
        toSqlValue(row.weight),
        toSqlValue(row.height),
        toSqlValue(row.citizenship),
        toSqlValue(row.email),
        toSqlValue(row.mobile),
        row.consent ? 1 : 0,
        toSqlValue(row.status ?? "new"),
        serializeJsonValue(row.notes ?? {}),
        toSqlValue(row.created_at),
      ] as SqlValue[],
    })),
    ...input.iponChallengeRegistrations.map((row) => ({
      sql: `
        INSERT OR REPLACE INTO ipon_challenge_registrations (
          id, reference_id, source_page, first_name, middle_name, last_name, gender,
          gender_other, civil_status, civil_status_other, date_of_birth,
          place_of_birth, age, weight, height, citizenship, email, mobile,
          consent, status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        toSqlValue(row.id),
        toSqlValue(row.reference_id),
        toSqlValue(row.source_page ?? "/membership"),
        toSqlValue(row.first_name),
        toSqlValue(row.middle_name),
        toSqlValue(row.last_name),
        toSqlValue(row.gender),
        toSqlValue(row.gender_other),
        toSqlValue(row.civil_status),
        toSqlValue(row.civil_status_other),
        toSqlValue(row.date_of_birth),
        toSqlValue(row.place_of_birth),
        toSqlValue(row.age ?? 0),
        toSqlValue(row.weight),
        toSqlValue(row.height),
        toSqlValue(row.citizenship),
        toSqlValue(row.email),
        toSqlValue(row.mobile),
        row.consent ? 1 : 0,
        toSqlValue(row.status ?? "new"),
        serializeJsonValue(row.notes ?? {}),
        toSqlValue(row.created_at),
      ] as SqlValue[],
    })),
  ];

  if (statements.length > 0) {
    await batchTurso(statements);
  }
}
