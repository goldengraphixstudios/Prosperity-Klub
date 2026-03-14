"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, MailCheck, ShieldCheck } from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { ResourceGateDialog } from "@/components/resource-gate-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resourceLinks } from "@/lib/site";

const ebookCoverUrl = "/resources/coverebook.png";
const ebookTitle = "The Secret to Saving and Building Your Future";

export default function ResourcesPage() {
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [requestSubmitted, setRequestSubmitted] = React.useState(false);

  return (
    <div className="py-20">
      <Container className="space-y-12">
        <FadeIn className="space-y-4">
          <Badge>Resources</Badge>
          <h1 className="text-4xl font-semibold text-brand-primary">
            Learn at your pace.
          </h1>
          <p className="max-w-2xl text-lg text-brand-muted">
            Access Prosperity Klub guides, PDFs, and learning materials crafted for
            Filipinos and OFWs.
          </p>
          <div className="max-w-3xl rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-primary">
              Why we ask for your email
            </p>
            <p className="mt-2">
              We use it to send the ebook directly to your inbox, continue your
              learning journey, and invite you into the next best step if you want
              guidance.
            </p>
            <p className="mt-2 text-brand-primary">We respect your inbox. No spam.</p>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden border-brand-primary/10 bg-white/85">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-background">
              <Image
                src={ebookCoverUrl}
                alt={`${ebookTitle} preview cover`}
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/55 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-brand-primary/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                <Lock className="h-3.5 w-3.5" />
                Preview Only
              </div>
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-white/92 p-4 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold text-brand-primary">
                  The live preview is intentionally locked.
                </p>
                <p className="mt-2 text-sm text-brand-muted">
                  This cover lets visitors see the resource without exposing the PDF
                  file publicly on the site.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-brand-primary/10 bg-white/85">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="soft">Free Ebook</Badge>
                <Badge variant="gold">Email Delivery</Badge>
              </div>
              <CardTitle className="text-2xl">{ebookTitle}</CardTitle>
              <p className="text-sm text-brand-muted">
                Cover preview only. Full PDF is delivered after form submission.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-brand-muted">
              <p>
                Build a confident money plan with a guided roadmap covering the
                essentials: protection, savings discipline, and long-term growth.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-primary/10 bg-brand-background/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                    <MailCheck className="h-4 w-4" />
                    Delivered to your inbox
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">
                    Submit the short form and we can send the full ebook privately.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-primary/10 bg-brand-background/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Protected resource flow
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">
                    The downloadable PDF is no longer exposed on the public website.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Financial basics",
                  "Emergency fund",
                  "Saving discipline",
                  "Protection",
                  "Long-term planning",
                  "Wealth growth",
                ].map((topic) => (
                  <Badge key={topic} variant="soft" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4">
                <p className="text-sm font-semibold text-brand-primary">
                  Request flow
                </p>
                <div className="mt-3 grid gap-3 text-sm text-brand-muted">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white">
                      1
                    </div>
                    <p>Fill out the ebook request form.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white">
                      2
                    </div>
                    <p>We capture your details and tag you as an ebook lead.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-brand-primary px-2 py-0.5 text-xs font-semibold text-white">
                      3
                    </div>
                    <p>The full file gets delivered through a private email flow.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="gold"
                  onClick={() => setRequestOpen(true)}
                  className="hover:scale-[1.02]"
                >
                  Request the Free Ebook
                </Button>
                <Button asChild variant="outline">
                  <Link href="/book">Book a Free Financial Clarity Session</Link>
                </Button>
              </div>
              {requestSubmitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">Request received.</p>
                  <p className="mt-1">
                    The ebook preview stays locked on-site, and the full PDF should be
                    sent through your delivery workflow after submission.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Need guidance after reading?</CardTitle>
              <p className="text-sm text-brand-muted">
                Book a free session and we&apos;ll help you map your next move after
                you review the resource.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild variant="gold">
                <Link href="/book">Book a Free Financial Clarity Session</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn className="space-y-6">
          <h2 className="text-2xl font-semibold text-brand-primary">
            External Resource Hub
          </h2>
          <p className="max-w-3xl text-sm text-brand-muted">
            These links support the main Prosperity Klub guidance journey. They do not
            replace qualification, mentorship, or a proper clarity session.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {resourceLinks.map((link) => (
              <Button
                key={link.label}
                variant="secondary"
                className="justify-start hover:scale-[1.02]"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </FadeIn>
      </Container>

      <ResourceGateDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        onSubmitted={() => setRequestSubmitted(true)}
      />
    </div>
  );
}
