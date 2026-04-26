import { NextResponse } from "next/server";

import { sendCheckupConfirmation } from "@/lib/email";
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
    const score = typeof data.score === "number" ? data.score : 0;
    const tier =
      data.tier === "green" || data.tier === "amber" || data.tier === "red"
        ? (data.tier as "green" | "amber" | "red")
        : "green";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const displayName = name || "Financial Check-up User";
    const requestedResource = `Financial Check-up — ${score} YES (${data.tierLabel ?? tier})`;

    const { error } = await supabase.from("ebook_requests").insert({
      name: displayName,
      email,
      source_page: "/resources/financial-checkup",
      requested_resource: requestedResource,
      status: "delivered",
      delivery_method: "email",
    });

    if (error) {
      throw new Error(error.message);
    }

    // Fire email without blocking — email failure must not fail the form
    void sendCheckupConfirmation({ to: email, name: displayName, score, tier }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
