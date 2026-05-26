import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ArrowRight, Tag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllStaticBlogPosts } from "@/lib/blogPosts";
import { listPublishedBlogPosts } from "@/lib/blog-store";
import { cmsRowToBlogPost } from "@/lib/cmsPostTypes";
import type { BlogPost } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Financial Learning Hub | Prosperity Klub Blog",
  description:
    "Philippine personal finance guides on savings, OFW planning, investing, debt strategies, insurance, and building wealth. Practical advice for every Filipino.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Financial Learning Hub | Prosperity Klub",
    description:
      "Practical Philippine personal finance guides: savings, OFW planning, investing, debt payoff, and building wealth.",
    type: "website",
    url: "https://prosperityklub.com/blog",
  },
};

export default async function BlogPage() {
  let cmsPosts: BlogPost[] = [];
  try {
    const rows = await listPublishedBlogPosts();
    cmsPosts = rows.map(cmsRowToBlogPost);
  } catch {
    // DB may not be available during build; fall through to static posts
  }

  const staticPosts = getAllStaticBlogPosts();
  const cmsSlugSet = new Set(cmsPosts.map((p) => p.slug));
  const combined = [...cmsPosts, ...staticPosts.filter((p) => !cmsSlugSet.has(p.slug))];

  const categories = ["All", ...Array.from(new Set(combined.map((p) => p.category)))];
  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "All" ? combined.length : combined.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  const featuredPost = combined[0];
  const restPosts = combined.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Financial Learning Hub | Prosperity Klub Blog",
    description:
      "Philippine personal finance guides on savings, OFW planning, investing, debt strategies, and building wealth.",
    url: "https://prosperityklub.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Prosperity Klub",
      url: "https://prosperityklub.com",
    },
    hasPart: combined.slice(0, 9).map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: `https://prosperityklub.com/blog/${post.slug}`,
      description: post.description,
      datePublished: post.publishedAt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-brand-primary py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold">
                <BookOpen className="h-3.5 w-3.5" />
                Learning Center
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Financial Learning Hub
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-secondary">
                Practical personal finance guides written for Filipinos — covering savings,
                OFW planning, investing, debt management, insurance, and building lasting wealth.
              </p>
              <p className="mt-3 text-sm text-brand-secondary/70">
                {combined.length} guides · Updated {new Date(combined[0]?.updatedAt ?? "").toLocaleDateString("en-PH", { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </section>

        {/* Category pills */}
        <div className="border-b border-brand-primary/8 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-primary/15 bg-brand-background px-4 py-1.5 text-xs font-semibold text-brand-muted hover:border-brand-gold/40 hover:text-brand-primary transition-colors cursor-default"
                >
                  <Tag className="h-3 w-3" />
                  {cat}
                  <span className="ml-0.5 rounded-full bg-brand-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-primary">
                    {categoryCounts[cat]}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <section className="bg-brand-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Featured post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group mb-10 block">
                <div className="overflow-hidden rounded-2xl border border-brand-primary/8 bg-white shadow-sm transition-all hover:border-brand-gold/30 hover:shadow-lg">
                  <div className="grid lg:grid-cols-[1fr_480px]">
                    <div className="relative aspect-[16/7] overflow-hidden lg:aspect-auto">
                      <Image
                        src={featuredPost.heroImage.src}
                        alt={featuredPost.heroImage.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-primary/10" />
                    </div>
                    <div className="flex flex-col justify-center p-7 sm:p-9">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                          {featuredPost.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-brand-primary sm:text-3xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted line-clamp-3">
                        {featuredPost.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-brand-gold group-hover:gap-3 transition-all">
                        Read guide
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-brand-primary/8 bg-white shadow-sm transition-all hover:border-brand-gold/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.heroImage.src}
                      alt={post.heroImage.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-muted">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-3 text-base font-bold leading-snug text-brand-primary line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-gold group-hover:gap-2.5 transition-all">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {combined.length === 0 && (
              <div className="py-24 text-center text-brand-muted">
                <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-30" />
                <p className="text-lg font-semibold">No articles found.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
