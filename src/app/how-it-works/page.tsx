"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, FileText, Handshake, MessageSquareText, Users } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { guidedNotSoldLine } from "@/lib/site";

const coreJourney = [
  {
    title: "Get Clarity",
    detail:
      "We understand your financial goals, income, and priorities before recommending anything.",
  },
  {
    title: "Get Matched",
    detail:
      "Through IMG's trusted infrastructure, we align you with the right financial solutions for your stage.",
  },
  {
    title: "Grow With Community",
    detail:
      "You gain mentorship, education, and access to opportunities that expand your income and long-term wealth.",
  },
];

const funnelSteps = [
  {
    icon: MessageSquareText,
    title: "First click",
    detail: "Facebook, referral, WhatsApp, booking page, or website visit.",
  },
  {
    icon: Handshake,
    title: "Conversation starts",
    detail: "We begin with your goals and what kind of clarity you actually need.",
  },
  {
    icon: FileText,
    title: "Qualification form",
    detail:
      "Your form helps us customize your path, segment your needs, and prepare more relevant guidance.",
  },
  {
    icon: CheckCircle2,
    title: "Guidance and matching",
    detail:
      "We guide you toward the right next step and use IMG's infrastructure when execution is needed.",
  },
  {
    icon: Users,
    title: "Follow-up and growth",
    detail:
      "After the first step, you stay connected to education, mentorship, and the wider community.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <Container className="space-y-14">
        <FadeIn className="grid gap-8 xl:grid-cols-[0.98fr_1.02fr] xl:items-center">
          <div className="space-y-5">
            <Badge>How It Works</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold text-brand-primary">
              Guided from first contact to long-term growth.
            </h1>
            <p className="max-w-3xl text-lg text-brand-muted">
              Prosperity Klub is designed to move people from uncertainty into clear,
              guided action. We start with understanding, then matching, then
              community-supported progress.
            </p>
            <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-primary">
              <p className="font-semibold">Not a sales trap. Just clarity first.</p>
              <p className="mt-2 text-brand-muted">{guidedNotSoldLine}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gold">
                <Link href="/book">Book a Free Financial Clarity Session</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Start the Qualification Form</Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-brand-primary/10 bg-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/brand/how-it-works-advisor.jpg"
                  alt="Advisor discussing a financial plan with a client"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
              <CardContent className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.26em] text-brand-secondary">
                  Journey preview
                </p>
                {coreJourney.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-brand-secondary">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-brand-primary">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm text-brand-muted">{step.detail}</p>
                  </div>
                ))}
              </CardContent>
            </div>
          </Card>
        </FadeIn>

        <FadeIn className="space-y-5">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-semibold text-brand-primary">
              The Prosperity Klub pathway
            </h2>
            <p className="text-sm text-brand-muted">
              This is the step-by-step line path behind the journey. It helps each
              person move from first contact into the right kind of guidance without
              being pushed blindly into products.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl px-2 py-4">
            <motion.div
              className="absolute left-[23px] top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-brand-gold via-brand-primary to-brand-secondary md:left-1/2 md:-translate-x-1/2"
              initial={{ scaleY: 0, opacity: 0.45 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.1, ease }}
              style={{ originY: 0 }}
            />

            <div className="space-y-8">
              {funnelSteps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease, delay: index * 0.05 }}
                    className="relative grid gap-4 md:grid-cols-2 md:gap-10"
                  >
                    <div className={isEven ? "md:pr-12" : "md:order-2 md:pl-12"}>
                      <Card className="border-brand-primary/10 bg-white/88 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                        <CardHeader className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">
                                Step {index + 1}
                              </p>
                              <CardTitle className="mt-1">{step.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm leading-7 text-brand-muted">
                          {step.detail}
                        </CardContent>
                      </Card>
                    </div>

                    <div className={isEven ? "md:order-2" : ""} />

                    <motion.div
                      className="absolute left-[24px] top-10 z-10 h-7 w-7 -translate-x-1/2 rounded-full border-4 border-white bg-brand-gold shadow-[0_0_0_8px_rgba(179,129,36,0.12)] md:left-1/2"
                      animate={{
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          "0 0 0 8px rgba(179,129,36,0.12)",
                          "0 0 0 12px rgba(179,129,36,0.08)",
                          "0 0 0 8px rgba(179,129,36,0.12)",
                        ],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.15,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-2">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Why the qualification form matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <p>
                The qualification form is not there to pressure people. It is there so
                we can understand priorities, readiness, and context before suggesting
                a path.
              </p>
              <p>
                That makes the next step more relevant, more responsible, and more
                useful.
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Where IMG fits in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <p>
                IMG provides the infrastructure, provider access, and licensed
                execution layer.
              </p>
              <p>
                Prosperity Klub provides the guidance, mentorship, and community
                experience that helps members move with more confidence.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold text-brand-primary">
            Common Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this a sales call?</AccordionTrigger>
              <AccordionContent>
                No. The first session is designed to understand your goals and give
                you clearer direction before any recommendation is made.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why do you ask for a qualification form?</AccordionTrigger>
              <AccordionContent>
                The form helps us segment your situation properly so your path is based
                on your priorities, readiness, and goals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What role does IMG play?</AccordionTrigger>
              <AccordionContent>
                IMG provides the infrastructure, provider access, and licensed
                execution layer. Prosperity Klub provides the guidance, mentorship,
                and community experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How soon will I hear back?</AccordionTrigger>
              <AccordionContent>
                We aim to follow up within 24 hours so you know the next best step
                quickly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FadeIn>
      </Container>
    </div>
  );
}
