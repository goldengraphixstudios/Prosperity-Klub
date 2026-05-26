import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDashboardData } from "@/lib/crm-store";

export async function GET(request: NextRequest) {
  try {
    const cookieAuthed = await isAdminAuthenticated();
    const headerKey = request.headers.get("x-admin-key");
    const expected = process.env.ADMIN_DASHBOARD_KEY;
    const headerAuthed = Boolean(expected && headerKey && headerKey === expected);

    if (!cookieAuthed && !headerAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(await getDashboardData());
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
