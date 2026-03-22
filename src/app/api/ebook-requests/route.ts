import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase server configuration is missing." },
        { status: 500 }
      );
    }

    const data = await request.json();
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("ebook_requests").insert({
      name,
      email,
      source_page:
        typeof data.source_page === "string" ? data.source_page : "/resources",
      requested_resource:
        typeof data.requested_resource === "string"
          ? data.requested_resource
          : "The Secret to Saving and Building Your Future",
      status: "pending",
      delivery_method: "email",
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true, stored: "supabase" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
