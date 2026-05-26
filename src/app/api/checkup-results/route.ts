import { NextResponse } from "next/server";

import { insertEbookRequest } from "@/lib/crm-store";
import { sendCheckupConfirmation, sendCheckupOwnerNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
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

    await insertEbookRequest({
      name: displayName,
      email,
      sourcePage: "/resources/financial-checkup",
      requestedResource,
      status: "sent",
      deliveryMethod: "email",
      notes: {
        score,
        tier,
      },
    });

    await Promise.allSettled([
      sendCheckupConfirmation({ to: email, name: displayName, score, tier }),
      sendCheckupOwnerNotification({
        name: displayName,
        email,
        score,
        tier,
        tierLabel: typeof data.tierLabel === "string" ? data.tierLabel : tier,
      }),
    ]);

    return NextResponse.json({ ok: true, stored: "turso" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
