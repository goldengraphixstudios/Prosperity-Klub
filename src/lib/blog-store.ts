import "server-only";
import { executeTurso, parseJsonValue, serializeJsonValue, rowToRecord } from "@/lib/turso";
import type { BlogImage, BlogFaq, BlogSection, BlogCta } from "@/lib/blogPosts";
import type { CmsPostRow, CmsPostStatus, CmsPostInput } from "@/lib/cmsPostTypes";

function decodeRow(row: Record<string, unknown>): CmsPostRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    status: row.status as CmsPostStatus,
    published_at: row.published_at as string,
    updated_at: row.updated_at as string,
    category: row.category as string,
    read_time: row.read_time as string,
    keywords: parseJsonValue<string[]>(row.keywords, []),
    summary: row.summary as string,
    deck: row.deck as string,
    hero_image: parseJsonValue<BlogImage>(row.hero_image, { src: "", alt: "" }),
    takeaways: parseJsonValue<string[]>(row.takeaways, []),
    sections: parseJsonValue<BlogSection[]>(row.sections, []),
    faqs: parseJsonValue<BlogFaq[]>(row.faqs, []),
    cta: parseJsonValue<BlogCta>(row.cta, { label: "", href: "" }),
    author_id: (row.author_id as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

export async function listPublishedBlogPosts(): Promise<CmsPostRow[]> {
  const result = await executeTurso(
    "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 100"
  );
  return result.rows.map((r) => decodeRow(rowToRecord(r)));
}

export async function listAllBlogPosts(): Promise<CmsPostRow[]> {
  const result = await executeTurso(
    "SELECT * FROM blog_posts ORDER BY updated_at DESC LIMIT 200"
  );
  return result.rows.map((r) => decodeRow(rowToRecord(r)));
}

export async function getBlogPostBySlug(slug: string): Promise<CmsPostRow | null> {
  const result = await executeTurso({
    sql: "SELECT * FROM blog_posts WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  const row = result.rows[0];
  return row ? decodeRow(rowToRecord(row)) : null;
}

export async function upsertBlogPost(input: CmsPostInput): Promise<CmsPostRow> {
  const now = new Date().toISOString().slice(0, 10);
  if (input.id) {
    await executeTurso({
      sql: `UPDATE blog_posts SET slug=?,title=?,description=?,status=?,published_at=?,updated_at=?,category=?,read_time=?,keywords=?,summary=?,deck=?,hero_image=?,takeaways=?,sections=?,faqs=?,cta=?,author_id=? WHERE id=?`,
      args: [
        input.slug, input.title, input.description, input.status,
        input.published_at, now, input.category, input.read_time,
        serializeJsonValue(input.keywords), input.summary, input.deck,
        serializeJsonValue(input.hero_image), serializeJsonValue(input.takeaways),
        serializeJsonValue(input.sections), serializeJsonValue(input.faqs),
        serializeJsonValue(input.cta), input.author_id ?? null, input.id,
      ],
    });
    const saved = await executeTurso({ sql: "SELECT * FROM blog_posts WHERE id=?", args: [input.id] });
    return decodeRow(rowToRecord(saved.rows[0]));
  } else {
    const id = crypto.randomUUID().replace(/-/g, "");
    await executeTurso({
      sql: `INSERT INTO blog_posts (id,slug,title,description,status,published_at,updated_at,category,read_time,keywords,summary,deck,hero_image,takeaways,sections,faqs,cta,author_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        id, input.slug, input.title, input.description, input.status,
        input.published_at, now, input.category, input.read_time,
        serializeJsonValue(input.keywords), input.summary, input.deck,
        serializeJsonValue(input.hero_image), serializeJsonValue(input.takeaways),
        serializeJsonValue(input.sections), serializeJsonValue(input.faqs),
        serializeJsonValue(input.cta), input.author_id ?? null,
      ],
    });
    const saved = await executeTurso({ sql: "SELECT * FROM blog_posts WHERE id=?", args: [id] });
    return decodeRow(rowToRecord(saved.rows[0]));
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  await executeTurso({ sql: "DELETE FROM blog_posts WHERE id=?", args: [id] });
}
