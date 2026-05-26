import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteBlogPost } from "@/lib/blog-store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
