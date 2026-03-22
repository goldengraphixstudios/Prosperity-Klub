import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const headerKey = request.headers.get("x-admin-key");
    const expected = process.env.ADMIN_DASHBOARD_KEY;
    const cookieAuthed = await isAdminAuthenticated();
    const headerAuthed = Boolean(expected && headerKey && headerKey === expected);

    if (!cookieAuthed && !headerAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase server configuration is missing." },
        { status: 500 }
      );
    }

    const [
      leadsCountResult,
      ebookCountResult,
      fullAccessCountResult,
      iponChallengeCountResult,
      leadsResult,
      ebooksResult,
      fullAccessResult,
      iponChallengeResult,
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("ebook_requests").select("*", { count: "exact", head: true }),
      supabase
        .from("full_access_registrations")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("ipon_challenge_registrations")
        .select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
      supabase
        .from("ebook_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("full_access_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("ipon_challenge_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const errors = [
      leadsCountResult.error,
      ebookCountResult.error,
      fullAccessCountResult.error,
      iponChallengeCountResult.error,
      leadsResult.error,
      ebooksResult.error,
      fullAccessResult.error,
      iponChallengeResult.error,
    ].filter(Boolean);

    if (errors.length) {
      throw new Error(errors.map((error) => error?.message).join(", "));
    }

    return NextResponse.json({
      counts: {
        leads: leadsCountResult.count ?? 0,
        ebook_requests: ebookCountResult.count ?? 0,
        full_access_registrations: fullAccessCountResult.count ?? 0,
        ipon_challenge_registrations: iponChallengeCountResult.count ?? 0,
      },
      leads: leadsResult.data ?? [],
      ebook_requests: ebooksResult.data ?? [],
      full_access_registrations: fullAccessResult.data ?? [],
      ipon_challenge_registrations: iponChallengeResult.data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
