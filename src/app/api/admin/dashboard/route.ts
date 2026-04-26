import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const cookieAuthed = await isAdminAuthenticated();
    const headerKey = request.headers.get("x-admin-key");
    const expected = process.env.ADMIN_DASHBOARD_KEY;
    const headerAuthed = Boolean(expected && headerKey && headerKey === expected);

    if (!cookieAuthed && !headerAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase configuration missing. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 }
      );
    }

    const [
      leadsCountRes,
      ebookCountRes,
      fullAccessCountRes,
      iponCountRes,
      leadsRes,
      ebookRes,
      fullAccessRes,
      iponRes,
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("ebook_requests").select("*", { count: "exact", head: true }),
      supabase.from("full_access_registrations").select("*", { count: "exact", head: true }),
      supabase.from("ipon_challenge_registrations").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("ebook_requests").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("full_access_registrations").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("ipon_challenge_registrations").select("*").order("created_at", { ascending: false }).limit(200),
    ]);

    // Surface the first Supabase error clearly
    const firstError = [leadsCountRes, ebookCountRes, fullAccessCountRes, iponCountRes, leadsRes, ebookRes, fullAccessRes, iponRes]
      .find((r) => r.error)?.error;

    if (firstError) {
      return NextResponse.json({ error: `Supabase error: ${firstError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      counts: {
        leads: leadsCountRes.count ?? 0,
        ebook_requests: ebookCountRes.count ?? 0,
        full_access_registrations: fullAccessCountRes.count ?? 0,
        ipon_challenge_registrations: iponCountRes.count ?? 0,
      },
      leads: leadsRes.data ?? [],
      ebook_requests: ebookRes.data ?? [],
      full_access_registrations: fullAccessRes.data ?? [],
      ipon_challenge_registrations: iponRes.data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
