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

    const requiredStringFields = [
      "reference_id",
      "first_name",
      "middle_name",
      "last_name",
      "gender",
      "civil_status",
      "date_of_birth",
      "place_of_birth",
      "age",
      "weight",
      "height",
      "citizenship",
      "email",
    ] as const;

    const missing = requiredStringFields.filter((field) => {
      const value = data[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missing.length || data.consent !== true) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${[
            ...missing,
            ...(data.consent === true ? [] : ["consent"]),
          ].join(", ")}`,
        },
        { status: 400 }
      );
    }

    const age = Number(data.age);
    if (!Number.isFinite(age) || age < 0) {
      return NextResponse.json({ error: "Age must be a valid number." }, { status: 400 });
    }

    const { error } = await supabase.from("ipon_challenge_registrations").insert({
      reference_id: data.reference_id.trim(),
      source_page: typeof data.source_page === "string" ? data.source_page : "/membership",
      first_name: data.first_name.trim(),
      middle_name: data.middle_name.trim(),
      last_name: data.last_name.trim(),
      gender: data.gender.trim(),
      gender_other:
        typeof data.gender_other === "string" ? data.gender_other.trim() || null : null,
      civil_status: data.civil_status.trim(),
      civil_status_other:
        typeof data.civil_status_other === "string"
          ? data.civil_status_other.trim() || null
          : null,
      date_of_birth: data.date_of_birth.trim(),
      place_of_birth: data.place_of_birth.trim(),
      age,
      weight: data.weight.trim(),
      height: data.height.trim(),
      citizenship: data.citizenship.trim(),
      email: data.email.trim(),
      mobile: typeof data.mobile === "string" ? data.mobile.trim() || null : null,
      consent: true,
      status: "new",
      notes:
        typeof data.notes === "object" && data.notes !== null
          ? data.notes
          : {
              submitted_at: new Date().toISOString(),
            },
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
