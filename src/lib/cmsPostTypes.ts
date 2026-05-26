import type { BlogPost } from "@/lib/blogPosts";

export type CmsPostStatus = "draft" | "published";

export type CmsPostRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: CmsPostStatus;
  published_at: string;
  updated_at: string;
  category: string;
  read_time: string;
  keywords: string[];
  summary: string;
  deck: string;
  hero_image: BlogPost["heroImage"];
  takeaways: string[];
  sections: BlogPost["sections"];
  faqs: BlogPost["faqs"];
  cta: BlogPost["cta"];
  author_id: string | null;
  created_at: string;
};

export type CmsPostInput = Omit<CmsPostRow, "id" | "created_at"> & { id?: string };

export function cmsRowToBlogPost(row: CmsPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    category: row.category,
    readTime: row.read_time,
    keywords: row.keywords ?? [],
    summary: row.summary,
    deck: row.deck,
    heroImage: row.hero_image,
    takeaways: row.takeaways ?? [],
    sections: row.sections ?? [],
    faqs: row.faqs ?? [],
    cta: row.cta,
  };
}
