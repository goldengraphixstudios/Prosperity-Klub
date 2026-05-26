import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteDashboardRecord, type DashboardTable } from "@/lib/crm-store";

const allowedTables = new Set<DashboardTable>([
  "leads",
  "ebook_requests",
  "full_access_registrations",
  "ipon_challenge_registrations",
]);

export async function DELETE(request: NextRequest) {
  try {
    const cookieAuthed = await isAdminAuthenticated();
    const headerKey = request.headers.get("x-admin-key");
    const expected = process.env.ADMIN_DASHBOARD_KEY;
    const headerAuthed = Boolean(expected && headerKey && headerKey === expected);

    if (!cookieAuthed && !headerAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const table = typeof body.table === "string" ? (body.table as DashboardTable) : null;
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!table || !allowedTables.has(table)) {
      return NextResponse.json({ error: "Invalid table." }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Record id is required." }, { status: 400 });
    }

    await deleteDashboardRecord(table, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
