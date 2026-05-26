import { NextResponse } from "next/server";

import { insertEbookRequest } from "@/lib/crm-store";
import { sendEbookDelivery, sendEbookOwnerNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const sourcePage =
      typeof data.source_page === "string" ? data.source_page : "/resources";
    const requestedResource =
      typeof data.requested_resource === "string"
        ? data.requested_resource
        : "The Secret to Saving and Building Your Future";

    await insertEbookRequest({
      name,
      email,
      sourcePage,
      requestedResource,
      status: "sent",
      deliveryMethod: "email",
      notes: { delivered_by: "resend" },
    });

    // Send emails concurrently — don't block response on failure
    await Promise.allSettled([
      sendEbookDelivery({ to: email, name, requestedResource }),
      sendEbookOwnerNotification({ name, email, requestedResource, sourcePage }),
    ]);

    return NextResponse.json({ ok: true, stored: "turso" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
