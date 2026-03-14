"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  ExternalLink,
  GraduationCap,
  Handshake,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  Users,
  Waypoints,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Container } from "@/components/container";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  guidedNotSoldLine,
  positioningLine,
} from "@/lib/site";
import {
  successStories,
  successStoriesPlaylistUrl,
} from "@/lib/success-stories";
import { withBasePath } from "@/lib/utils";

const steps = [
  {
    title: "Get Clarity",
    description: "We understand your goals, income, and priorities first.",
    icon: Compass,
  },
  {
    title: "Get Matched",
    description:
      "IMG's infrastructure helps connect the right execution path when you are ready.",
    icon: Waypoints,
  },
  {
    title: "Grow With Community",
    description:
      "You continue with mentorship, education, and long-term growth support.",
    icon: TrendingUp,
  },
];

const highlights = [
  "Growing community since 2020",
  "Built for Filipinos and OFWs",
  "Guidance first, execution second",
];

const beyondPlanning = [
  { label: "Upskilling programs", icon: GraduationCap },
  { label: "Business building guidance", icon: BriefcaseBusiness },
  { label: "Career and opportunity access", icon: Users },
  { label: "Diversified income pathways", icon: ArrowRight },
];

const moneySignals = [
  {
    label: "Saving rhythm",
    value: "₱5,000 / month",
    className: "-right-4 -top-2 sm:-right-6 sm:-top-3",
  },
  {
    label: "Emergency fund",
    value: "6-month target",
    className: "-left-2 top-28 sm:-left-8 sm:top-28",
  },
  {
    label: "Protection first",
    value: "Income secured",
    className: "right-0 top-1/2 sm:-right-7",
  },
  {
    label: "Wealth path",
    value: "Long-term growth",
    className: "-left-8 -bottom-4 sm:-left-10 sm:-bottom-6",
  },
];

const featuredStories = successStories;

export default function HomePage() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const blobY = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : 40]);

  return (
    <div>
      <section className="relative overflow-hidden pb-16 pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,166,207,0.35),_transparent_55%)]" />
        <motion.div
          className="absolute right-0 top-6 h-56 w-56 rounded-full bg-brand-gold/10"
          style={{ y: blobY }}
        />

        <Container className="relative">
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <FadeIn className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="gold">Guided, Not Sold</Badge>
                <Badge variant="soft">Powered by IMG Infrastructure</Badge>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-secondary">
                Prosperity Klub
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.94] text-brand-primary md:text-[4rem]">
                Financial guidance, community, and growth for Filipinos.
              </h1>
              <p className="max-w-2xl text-lg text-brand-muted">
                Prosperity Klub is a financial growth community under International
                Marketing Group (IMG), built to help Filipinos build protection,
                wealth, and diversified income opportunities.
              </p>
              <p className="max-w-2xl text-sm text-brand-muted">{positioningLine}</p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold">
                  <Link href="/book">Book a Free Financial Clarity Session</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/membership">Explore Membership</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <Badge key={item} variant="soft" className="px-3 py-1 text-[11px]">
                    {item}
                  </Badge>
                ))}
              </div>

              <Card className="mt-12 overflow-hidden border-brand-primary/10 bg-white/92 shadow-[0_18px_45px_rgba(26,54,121,0.1)] lg:mt-16">
                <div className="grid gap-4 sm:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[12rem] overflow-hidden sm:min-h-full">
                    <Image
                      src={withBasePath("/resources/coverebook.png")}
                      alt="Free Prosperity Klub ebook cover"
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/78 via-brand-primary/18 to-transparent" />
                    <div className="absolute left-4 top-4">
                      <Badge variant="gold">Free Ebook</Badge>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-secondary">
                        Prefer a lower-commitment first step?
                      </p>
                      <h3 className="text-2xl font-semibold text-brand-primary">
                        Request the savings and wealth-building guide.
                      </h3>
                    </div>
                    <p className="text-sm text-brand-muted">
                      Visitors can preview the cover on-site, then request the full
                      ebook through the protected email flow.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/resources">Get the Free Ebook</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn className="space-y-4">
              <div className="relative rounded-[2rem] border border-brand-primary/10 bg-white/88 p-4 shadow-[0_18px_45px_rgba(26,54,121,0.12)] sm:p-5">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(179,129,36,0.14),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(148,166,207,0.16),_transparent_42%)]" />
                {moneySignals.map((signal, index) => (
                  <motion.div
                    key={signal.value}
                    className={`absolute z-20 max-w-[11rem] rounded-2xl border border-brand-gold/60 bg-brand-gold px-3 py-2 shadow-[0_16px_32px_rgba(179,129,36,0.34)] ${signal.className}`}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, index % 2 === 0 ? 1.5 : -1.5, 0],
                    }}
                    transition={{
                      duration: 4.6 + index * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: index * 0.25,
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/78">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {signal.value}
                    </p>
                  </motion.div>
                ))}

                <div className="relative overflow-hidden rounded-[1.7rem] border border-white/60">
                  <div className="relative aspect-[4/4.7] overflow-hidden">
                    <Image
                      src={withBasePath("/brand/about-finance-planning.jpg")}
                      alt="Filipino financial planning conversation at a desk"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/18 to-transparent" />
                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <Badge variant="soft" className="border-white/40 bg-white/85">
                        Financial clarity
                      </Badge>
                      <Badge
                        variant="soft"
                        className="border-white/50 bg-white text-brand-gold shadow-sm"
                      >
                        Money habits
                      </Badge>
                    </div>
                    <div className="absolute inset-x-5 bottom-5 space-y-2 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
                        Community-led guidance
                      </p>
                      <p className="max-w-sm text-2xl font-semibold leading-tight">
                        Build protection, savings discipline, and income confidence.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute -bottom-5 right-4 z-20 hidden w-[14.5rem] rounded-[1.5rem] border border-white/60 bg-white/95 p-3 shadow-[0_18px_35px_rgba(15,23,42,0.16)] backdrop-blur sm:block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-brand-primary/10">
                      <Image
                        src={withBasePath("/brand/founder.png")}
                        alt="Founder of Prosperity Klub"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-secondary">
                        Founder-led
                      </p>
                      <p className="text-sm font-semibold text-brand-primary">
                        Mentorship with real human guidance
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <Card className="mt-12 border-brand-primary/10 bg-white/92 shadow-[0_18px_45px_rgba(26,54,121,0.12)] lg:mt-16">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="soft">Why it works</Badge>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-secondary">
                      Compact Overview
                    </span>
                  </div>
                  <CardTitle className="text-2xl">
                    Clarity first. Pressure last.
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-brand-muted">
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-primary">{step.title}</p>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4">
                    <p className="font-semibold text-brand-primary">{guidedNotSoldLine}</p>
                    <p className="mt-2">
                      Prosperity Klub leads the guidance, mentorship, and growth
                      environment. IMG provides the execution engine and trusted
                      institution access behind the scenes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="pb-12 pt-24 lg:pt-28">
        <Container>
          <FadeIn className="rounded-[2rem] border border-brand-primary/10 bg-white/70 px-6 py-8 shadow-[0_18px_45px_rgba(26,54,121,0.08)] md:px-8">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-secondary">
                Simple path
              </p>
              <h2 className="text-3xl font-semibold text-brand-primary">
                A guided journey from clarity to action.
              </h2>
            </div>

            <div className="relative mt-10">
              <motion.div
                className="absolute left-8 top-8 hidden h-1 rounded-full bg-gradient-to-r from-brand-gold via-brand-primary to-brand-secondary md:block"
                style={{ width: "calc(100% - 4rem)" }}
                initial={{ scaleX: 0, opacity: 0.4 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.4 }}
              />

              <div className="absolute inset-x-8 top-0 hidden md:flex items-start justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={`${step.title}-desktop-node`}
                      className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-primary text-white shadow-[0_14px_30px_rgba(26,54,121,0.22)]"
                      animate={{
                        y: [0, -6, 0],
                        boxShadow: [
                          "0 14px 30px rgba(26,54,121,0.18)",
                          "0 18px 34px rgba(179,129,36,0.24)",
                          "0 14px 30px rgba(26,54,121,0.18)",
                        ],
                      }}
                      transition={{
                        duration: 3.8 + index * 0.35,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="h-7 w-7" />
                      <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-gold text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Stagger>
                <div className="grid gap-6 pt-4 md:grid-cols-3 md:pt-18">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <StaggerItem key={step.title} className="relative">
                        <div className="flex h-full flex-col items-start">
                          <motion.div
                            className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-primary text-white shadow-[0_14px_30px_rgba(26,54,121,0.22)] md:hidden"
                            animate={{
                              y: [0, -6, 0],
                              boxShadow: [
                                "0 14px 30px rgba(26,54,121,0.18)",
                                "0 18px 34px rgba(179,129,36,0.24)",
                                "0 14px 30px rgba(26,54,121,0.18)",
                              ],
                            }}
                            transition={{
                              duration: 3.8 + index * 0.35,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <Icon className="h-7 w-7" />
                            <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-gold text-xs font-semibold text-white">
                              {index + 1}
                            </div>
                          </motion.div>

                          <Card className="h-full w-full border-brand-primary/10 bg-white/88">
                            <CardHeader className="space-y-3">
                              <p className="text-xs uppercase tracking-[0.25em] text-brand-secondary">
                                Step {index + 1}
                              </p>
                              <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-brand-muted">
                              {step.description}
                            </CardContent>
                          </Card>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </div>
              </Stagger>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-18">
        <Container>
          <FadeIn className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-sm uppercase tracking-[0.32em] text-brand-secondary">
                  Success Stories
                </p>
                <h2 className="text-3xl font-semibold text-brand-primary">
                  Real stories from the wider community.
                </h2>
                <p className="text-brand-muted">
                  These videos show the kind of transformation that happens when
                  people combine education, discipline, and the right support system.
                </p>
              </div>
              <Button asChild variant="outline">
                <a href={successStoriesPlaylistUrl} target="_blank" rel="noopener noreferrer">
                  View full playlist
                </a>
              </Button>
            </div>

            <Stagger>
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {featuredStories.map((story) => (
                  <StaggerItem key={story.videoId}>
                    <Card className="h-full border-brand-primary/10 bg-white/85">
                      <CardContent className="space-y-4 p-4">
                        <a
                          href={story.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block overflow-hidden rounded-2xl border border-brand-primary/10"
                        >
                          <div className="relative aspect-video overflow-hidden bg-brand-primary">
                            <Image
                              src={`https://i.ytimg.com/vi/${story.videoId}/hqdefault.jpg`}
                              alt={story.title}
                              fill
                              unoptimized
                              className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-brand-primary shadow-lg">
                                <PlayCircle className="h-8 w-8" />
                              </div>
                            </div>
                          </div>
                        </a>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-secondary">
                            <PlayCircle className="h-4 w-4" />
                            <span>Success Story</span>
                          </div>
                          <h3 className="text-lg font-semibold text-brand-primary">
                            {story.title}
                          </h3>
                          <p className="text-sm text-brand-muted">{story.description}</p>
                          <a
                            href={story.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-gold"
                          >
                            Watch story
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          </FadeIn>
        </Container>
      </section>

      <section className="py-18">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <FadeIn className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-secondary">
                Beyond Financial Planning
              </p>
              <h2 className="text-3xl font-semibold text-brand-primary">
                Prosperity means more than protection and savings.
              </h2>
              <p className="text-brand-muted">
                Prosperity Klub also helps members expand their income capacity through
                learning, opportunities, and community-led growth.
              </p>
            </FadeIn>

            <div className="space-y-4">
              <FadeIn className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-h-[18rem] overflow-hidden rounded-[1.75rem] border border-brand-primary/10 shadow-[0_18px_35px_rgba(15,23,42,0.08)]">
                  <Image
                    src={withBasePath("/brand/how-it-works-advisor.jpg")}
                    alt="Advisor walking a client through financial next steps"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/75 via-brand-primary/10 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
                      Real support
                    </p>
                    <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight">
                      Guidance that turns financial ideas into concrete next steps.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-[18rem] overflow-hidden rounded-[1.75rem] border border-brand-primary/10 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.08)]">
                  <Image
                    src={withBasePath("/brand/founder.png")}
                    alt="Founder portrait of Prosperity Klub"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/22 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-white/12 p-4 text-white backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                      Founder presence
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      Built around mentorship, accountability, and long-term prosperity.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <Stagger>
                <div className="grid gap-4 md:grid-cols-2">
                  {beyondPlanning.map((item) => {
                    const Icon = item.icon;
                    return (
                      <StaggerItem key={item.label}>
                        <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/8 text-brand-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-base font-semibold text-brand-primary">
                            {item.label}
                          </p>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </div>
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-18">
        <Container>
          <FadeIn className="space-y-8">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-secondary">
                Membership Pathways
              </p>
              <h2 className="text-3xl font-semibold text-brand-primary">
                Choose the level of support that matches your season.
              </h2>
            </div>
            <Stagger>
              <div className="grid gap-6 md:grid-cols-2">
                <StaggerItem>
                  <Card className="h-full border-brand-primary/10 bg-white/80">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="gold">Recommended</Badge>
                        <Badge variant="soft">Full Access</Badge>
                      </div>
                      <CardTitle>Full Access Membership</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-brand-muted">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Education, trainings, and workshops</li>
                        <li>Protection and investment access through IMG partners</li>
                        <li>Mentorship, accountability, and opportunity expansion</li>
                      </ul>
                      <Button asChild variant="outline">
                        <Link href="/membership">Explore Membership</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="h-full border-brand-primary/10 bg-white/80">
                    <CardHeader>
                      <Badge variant="soft">Ipon Challenge</Badge>
                      <CardTitle>Start with an entry pathway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-brand-muted">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Installment-friendly entry point</li>
                        <li>Coaching, seminars, and community support</li>
                        <li>Upgrade path into broader membership benefits</li>
                      </ul>
                      <Button asChild variant="outline">
                        <Link href="/membership">Compare pathways</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              </div>
            </Stagger>
          </FadeIn>
        </Container>
      </section>

      <section className="py-18">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader className="space-y-3">
                  <Badge variant="soft">Principles</Badge>
                  <CardTitle>Why people stay in Prosperity Klub</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-brand-muted md:grid-cols-3">
                  <div className="rounded-xl border border-brand-primary/10 bg-brand-background p-4">
                    <ShieldCheck className="mb-3 h-5 w-5 text-brand-primary" />
                    <p className="font-semibold text-brand-primary">Guided, not sold</p>
                    <p className="mt-2">Every recommendation starts with fit and readiness.</p>
                  </div>
                  <div className="rounded-xl border border-brand-primary/10 bg-brand-background p-4">
                    <Handshake className="mb-3 h-5 w-5 text-brand-primary" />
                    <p className="font-semibold text-brand-primary">Mentored, not abandoned</p>
                    <p className="mt-2">Community support continues after the first session.</p>
                  </div>
                  <div className="rounded-xl border border-brand-primary/10 bg-brand-background p-4">
                    <Users className="mb-3 h-5 w-5 text-brand-primary" />
                    <p className="font-semibold text-brand-primary">Growth-minded, not narrow</p>
                    <p className="mt-2">Members grow in confidence, discipline, and income capacity.</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn className="rounded-3xl border border-brand-primary/10 bg-brand-primary px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-secondary">
                Ready to begin?
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Book a Free Financial Clarity Session
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/82">
                Join a growing community of financially empowered Filipinos. Start
                with a conversation that helps you see the next right move clearly.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold">
                  <Link href="/book">Book a Free Financial Clarity Session</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 bg-white/6 text-white hover:bg-white/12"
                >
                  <Link href="/about">Meet the Founder</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}
