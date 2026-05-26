import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, CheckCircle, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllStaticBlogPosts, getStaticBlogPost } from "@/lib/blogPosts";
import { getBlogPostBySlug } from "@/lib/blog-store";
import { cmsRowToBlogPost } from "@/lib/cmsPostTypes";
import type { BlogPost } from "@/lib/blogPosts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateStaticParams() {
  const posts = getAllStaticBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    const cmsRow = await getBlogPostBySlug(slug);
    if (cmsRow) post = cmsRowToBlogPost(cmsRow);
  } catch {
    // ignore db errors during build
  }
  if (!post) post = getStaticBlogPost(slug) ?? null;
  if (!post) return {};

  return {
    title: `${post.title} | Prosperity Klub`,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://prosperityklub.com/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.heroImage.src, alt: post.heroImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.heroImage.src],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    const cmsRow = await getBlogPostBySlug(slug);
    if (cmsRow) post = cmsRowToBlogPost(cmsRow);
  } catch {
    // ignore db errors
  }
  if (!post) post = getStaticBlogPost(slug) ?? null;
  if (!post) notFound();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: post.heroImage.src,
    author: {
      "@type": "Organization",
      name: "Prosperity Klub",
      url: "https://prosperityklub.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Prosperity Klub",
      url: "https://prosperityklub.com",
      logo: {
        "@type": "ImageObject",
        url: "https://prosperityklub.com/brand/logo-update.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://prosperityklub.com/blog/${slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  const faqJsonLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Navbar />
      <main>
        {/* Article header */}
        <header className="relative overflow-hidden bg-brand-primary">
          {post.heroImage.src && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={post.heroImage.src}
                alt=""
                fill
                className="object-cover blur-sm"
                priority
                sizes="100vw"
              />
            </div>
          )}
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learning Hub
            </Link>
            <div className="mt-6 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-brand-secondary">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-brand-secondary">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-brand-secondary sm:text-lg">
                {post.deck}
              </p>
            </div>
          </div>
        </header>

        {/* Hero image */}
        {post.heroImage.src && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <figure className="-mt-6 overflow-hidden rounded-2xl shadow-xl sm:-mt-10">
              <Image
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                width={1260}
                height={520}
                className="w-full object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1260px"
              />
              {post.heroImage.caption && (
                <figcaption className="bg-brand-primary/5 px-4 py-2 text-center text-xs text-brand-muted">
                  {post.heroImage.caption}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Main content */}
            <article>
              {/* Answer-first summary */}
              {post.summary && (
                <section className="mb-10 rounded-2xl border-l-4 border-brand-gold bg-brand-gold/5 p-6 sm:p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
                    Answer First
                  </p>
                  <p className="text-lg font-semibold leading-relaxed text-brand-primary sm:text-xl">
                    {post.summary}
                  </p>
                </section>
              )}

              {/* Sections */}
              <div className="space-y-12">
                {post.sections.map((section, index) => (
                  <section key={`${section.heading}-${index}`}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-bold tracking-[0.2em] text-brand-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-2xl font-black leading-tight tracking-tight text-brand-primary sm:text-3xl">
                        {section.heading}
                      </h2>
                    </div>

                    {section.image?.src && (
                      <figure className="mt-5 overflow-hidden rounded-2xl border border-brand-primary/8">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          width={760}
                          height={427}
                          className="w-full object-cover"
                          sizes="(max-width: 1024px) 100vw, 760px"
                        />
                        {section.image.caption && (
                          <figcaption className="border-t border-brand-primary/8 bg-brand-background px-4 py-2 text-xs text-brand-muted">
                            {section.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    <div className="mt-5 space-y-4">
                      {section.body.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-base leading-8 text-brand-muted"
                          dangerouslySetInnerHTML={{ __html: paragraph }}
                        />
                      ))}
                    </div>

                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-5 space-y-3">
                        {section.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex gap-3 text-sm leading-7 text-brand-muted"
                          >
                            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" />
                            <span dangerouslySetInnerHTML={{ __html: bullet }} />
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.quote && (
                      <blockquote className="mt-6 border-l-4 border-brand-gold py-2 pl-5">
                        <p
                          className="text-lg font-semibold leading-snug text-brand-primary"
                          dangerouslySetInnerHTML={{ __html: section.quote }}
                        />
                      </blockquote>
                    )}
                  </section>
                ))}
              </div>

              {/* FAQ */}
              {post.faqs.length > 0 && (
                <section className="mt-14">
                  <h2 className="mb-6 text-2xl font-black tracking-tight text-brand-primary">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {post.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="rounded-xl border border-brand-primary/10 bg-white px-5"
                      >
                        <AccordionTrigger className="py-4 text-left text-sm font-semibold text-brand-primary hover:text-brand-gold hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-sm leading-7 text-brand-muted">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* CTA box */}
              <div className="mt-14 overflow-hidden rounded-2xl bg-brand-primary p-8 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                  Take the next step
                </p>
                <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                  {post.cta.label}
                </h3>
                {post.cta.note && (
                  <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
                    {post.cta.note}
                  </p>
                )}
                <Link
                  href={post.cta.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
                >
                  {post.cta.label}
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                {/* Table of contents */}
                {post.sections.length > 0 && (
                  <div className="rounded-2xl border border-brand-primary/8 bg-white p-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
                      In this guide
                    </p>
                    <nav className="space-y-2">
                      {post.sections.map((section, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="mt-0.5 text-xs font-bold text-brand-gold/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm leading-snug text-brand-muted hover:text-brand-primary transition-colors cursor-default">
                            {section.heading}
                          </span>
                        </div>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Takeaways */}
                {post.takeaways.length > 0 && (
                  <div className="rounded-2xl border border-brand-primary/8 bg-brand-gold/5 p-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
                      Key Takeaways
                    </p>
                    <ul className="space-y-3">
                      {post.takeaways.map((item, index) => (
                        <li key={index} className="flex gap-2.5 text-sm leading-snug text-brand-primary">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sidebar CTA */}
                <div className="rounded-2xl bg-brand-primary p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                    Free Session
                  </p>
                  <p className="mt-2 text-sm font-bold text-white">
                    Get personalized financial advice from a Prosperity Klub adviser.
                  </p>
                  <Link
                    href="/book"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
                  >
                    Book Free Session
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:hidden lg:px-8">
          <div className="rounded-2xl bg-brand-primary p-6 text-center">
            <p className="text-sm font-bold text-white">{post.cta.note}</p>
            <Link
              href={post.cta.href}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              {post.cta.label}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
