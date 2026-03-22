import { NextResponse } from "next/server";

import { createAdminSession, isAdminCredentialValid } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const username = typeof data.username === "string" ? data.username.trim() : "";
    const password = typeof data.password === "string" ? data.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (!isAdminCredentialValid(username, password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await createAdminSession(username);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
