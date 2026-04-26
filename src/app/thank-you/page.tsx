import Link from "next/link";
import { BookOpen, Calendar, CheckCircle2, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for reaching out to Prosperity Klub. We'll get back to you within 24 hours.",
};

const nextSteps = [
  {
    icon: Calendar,
    title: "Book a free clarity session",
    description: "Skip the wait — book directly and we'll walk you through your financial options.",
    href: "/book",
    cta: "Book Now",
  },
  {
    icon: BookOpen,
    title: "Grab our free ebook",
    description: "The Secret to Saving and Building Your Future — a practical guide for Filipinos.",
    href: "/resources",
    cta: "Get the Ebook",
  },
  {
    icon: MessageCircle,
    title: "Take the Financial Check-up",
    description: "Answer 8 quick questions and find out exactly where you stand financially.",
    href: "/resources/financial-checkup",
    cta: "Start Check-up",
  },
];

export default function ThankYouPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="mx-auto max-w-2xl space-y-10">
          {/* Hero */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
              <CheckCircle2 className="h-8 w-8 text-brand-primary" />
            </div>
            <h1 className="text-4xl font-semibold text-brand-primary">
              Thank you for reaching out!
            </h1>
            <p className="text-lg text-brand-muted">
              We received your message. Our team will get back to you within{" "}
              <strong className="text-brand-primary">24 hours</strong>.
            </p>
            <p className="text-sm text-brand-muted">
              While you wait, here are a few ways to make the most of your time with Prosperity Klub.
            </p>
          </div>

          {/* Next steps */}
          <div className="space-y-3">
            {nextSteps.map(({ icon: Icon, title, description, href, cta }) => (
              <div
                key={href}
                className="flex items-start gap-5 rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-[0_2px_12px_rgba(26,54,121,0.06)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/8">
                  <Icon className="h-5 w-5 text-brand-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-brand-primary">{title}</p>
                  <p className="text-sm text-brand-muted">{description}</p>
                </div>
                <Button asChild variant="outline" className="shrink-0 self-center">
                  <Link href={href}>{cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="text-center">
            <Button asChild variant="gold" size="lg" className="mx-auto hover:scale-[1.02]">
              <Link href="/book">
                <Calendar className="h-4 w-4" />
                Book a Free Financial Clarity Session
              </Link>
            </Button>
            <p className="mt-3 text-xs text-brand-muted">
              No commitment. Just clarity on your next financial move.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
