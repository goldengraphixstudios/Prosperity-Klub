import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listAllBlogPosts, upsertBlogPost } from "@/lib/blog-store";
import type { CmsPostInput } from "@/lib/cmsPostTypes";

export async function GET() {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const posts = await listAllBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json() as CmsPostInput;
    const post = await upsertBlogPost(body);
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
