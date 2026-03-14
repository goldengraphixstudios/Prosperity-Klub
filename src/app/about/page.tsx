import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/container";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  communityHeadline,
  guidedNotSoldLine,
  positioningLine,
} from "@/lib/site";
import { withBasePath } from "@/lib/utils";

const timeline = [
  {
    year: "2020",
    title: "Started with trusted friends",
    description:
      "Prosperity Klub began as a small group focused on practical money guidance and accountability.",
  },
  {
    year: "2021 - 2023",
    title: "Community momentum grew",
    description:
      "Members kept inviting others who wanted ongoing mentorship, clearer explanations, and a safer place to ask questions.",
  },
  {
    year: "2024 onward",
    title: "Clearer identity",
    description:
      "Prosperity Klub matured into a financial growth community powered by IMG's infrastructure and guided by mentorship first.",
  },
];

const missionPoints = [
  "Build disciplined financial confidence",
  "Help Filipinos protect their families properly",
  "Create multiple pathways for income growth",
  "Support long-term, values-driven prosperity",
];

export default function AboutPage() {
  return (
    <div className="py-16">
      <Container className="space-y-14">
        <FadeIn className="space-y-5">
          <Badge>About</Badge>
          <h1 className="max-w-4xl text-4xl font-semibold text-brand-primary">
            The real identity of Prosperity Klub
          </h1>
          <p className="max-w-3xl text-lg text-brand-muted">
            Prosperity Klub is not just an affiliate hub, resource site, or booking
            page. It is a financial growth community built to help Filipinos gain
            protection, clarity, wealth-building habits, and long-term opportunity.
          </p>
          <p className="max-w-3xl text-sm text-brand-muted">{positioningLine}</p>
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-[36px] border border-brand-primary/10 bg-white/90 shadow-[0_24px_60px_rgba(26,54,121,0.12)]">
            <div className="grid gap-0 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[640px] bg-gradient-to-br from-brand-primary to-[#223f88]">
                <Image
                  src={withBasePath("/brand/founder.png")}
                  alt="Philip Ian Ymbong, founder and financial education mentor"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1280px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/28 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.32em] text-brand-secondary">
                    Founder & Financial Education Mentor
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold">Philip Ian Ymbong</h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/86">
                    {communityHeadline}
                  </p>
                </div>
              </div>

              <div className="space-y-6 px-8 py-9">
                <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-5">
                  <p className="font-semibold text-brand-primary">{guidedNotSoldLine}</p>
                  <p className="mt-2 text-sm text-brand-muted">
                    Prosperity Klub was built to give Filipinos more than access to
                    products. It exists to provide guidance, mentorship, context, and
                    a serious growth environment.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-7 text-brand-muted">
                  <p>
                    I didn&apos;t build Prosperity Klub overnight. Like many Filipinos,
                    I saw hardworking people, especially OFWs, still struggle with
                    financial clarity, protection, and long-term planning.
                  </p>
                  <p>
                    When I discovered financial education through International
                    Marketing Group (IMG), I saw something different: knowledge first,
                    structure second, and execution done properly through licensed
                    systems and trusted institutions.
                  </p>
                  <p>
                    That changed my direction. Prosperity Klub was born from that
                    commitment, not just to connect people to products, but to build a
                    community where people grow in discipline, confidence, and
                    prosperity.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">
                      Core role
                    </p>
                    <p className="mt-3 text-lg font-semibold text-brand-primary">
                      Mentor, educator, and community builder
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">
                      Partnership model
                    </p>
                    <p className="mt-3 text-lg font-semibold text-brand-primary">
                      Prosperity Klub guides. IMG supports execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <FadeIn className="space-y-6">
            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Prosperity Klub and IMG</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-brand-muted">
                <p>
                  Prosperity Klub is the community, education, mentorship, and growth
                  environment.
                </p>
                <p>
                  IMG is the execution engine, licensed infrastructure, and financial
                  product access layer.
                </p>
                <p>
                  Through IMG&apos;s infrastructure and partnerships, members gain access
                  to financial solutions, while Prosperity Klub provides mentorship,
                  support, and community growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Personal mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-brand-muted">
                <p>
                  My mission is to help Filipinos avoid the financial mistakes most of
                  us were never taught about, and to replace confusion with education,
                  discipline, and a trusted support system.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {missionPoints.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-brand-primary/10 bg-brand-background p-4 text-brand-primary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn className="space-y-6">
            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Why the founder story matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-brand-muted">
                <p>
                  Prosperity Klub is personal before it is operational. The platform
                  exists because people needed clearer explanations, stronger support,
                  and a safer place to ask financial questions without pressure.
                </p>
                <p>
                  That is why the founder section is not just biography. It is proof
                  of the values behind the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-brand-primary/10 bg-white/80">
              <div className="relative aspect-[16/10]">
                <Image
                  src={withBasePath("/brand/about-finance-planning.jpg")}
                  alt="Financial planning documents and strategy discussion on a desk"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
              <CardContent className="space-y-3 p-5 text-sm text-brand-muted">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">
                  Guidance In Practice
                </p>
                <p>
                  This is the kind of work Prosperity Klub is built around: clearer
                  planning, better conversations, and decisions made with more
                  structure and context.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <Stagger className="grid gap-6 md:grid-cols-3">
          {timeline.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="h-full border-brand-primary/10 bg-white/80">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-secondary">
                    {item.year}
                  </p>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-muted">
                  {item.description}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card className="h-full border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Why I chose IMG</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-brand-muted">
                <p>
                  I chose International Marketing Group (IMG) because it provides the
                  infrastructure, partnerships, and licensed access needed to execute
                  financial solutions properly and legally.
                </p>
                <p>
                  IMG already had trusted provider relationships, educational systems,
                  and a structured path toward financial independence. But
                  infrastructure alone is not enough. People still need mentorship,
                  support, and accountability.
                </p>
                <p>
                  That is where Prosperity Klub comes in. IMG handles execution.
                  Prosperity Klub handles the guidance, mentorship, and growth
                  environment.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card className="h-full border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Why I built Prosperity Klub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-brand-muted">
                <p>
                  People wanted more than policies or investments. They wanted clear
                  explanations, ongoing mentorship, a support system, a safe place to
                  ask questions, and opportunities to increase income.
                </p>
                <p>
                  Beyond financial protection and investments, Prosperity Klub also
                  focuses on upskilling, business building guidance, access to
                  opportunities, and diversified income pathways.
                </p>
                <p>
                  Because true prosperity is not just about saving money. It is about
                  building multiple pathways for growth.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn className="rounded-[32px] border border-brand-primary/10 bg-brand-primary px-8 py-10 text-white">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-secondary">
                Vision for the future
              </p>
              <h2 className="text-3xl font-semibold">
                This is more than financial planning.
              </h2>
              <p className="text-sm leading-7 text-white/82">
                Prosperity Klub is a lifetime mission to build a strong, values-driven
                community that empowers Filipinos locally and abroad to protect their
                families, invest with discipline, increase their income capacity, and
                create long-term generational stability.
              </p>
            </div>
            <div className="space-y-3 text-sm text-white/84">
              <p>Next-growth directions include:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Structured mentorship programs</li>
                <li>Financial literacy campaigns</li>
                <li>Upskilling workshops</li>
                <li>Leadership development</li>
                <li>Digital tools and educational resources</li>
                <li>Team recruitment, onboarding, events, and announcements</li>
              </ul>
              <div className="pt-3">
                <Button asChild variant="gold">
                  <Link href="/book">Book a Free Financial Clarity Session</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="flex items-center justify-center rounded-3xl border border-brand-primary/10 bg-white/80 p-8">
          <Image
            src={withBasePath("/brand/logo-update.png")}
            alt="Prosperity Klub logo"
            width={220}
            height={80}
          />
        </FadeIn>
      </Container>
    </div>
  );
}
