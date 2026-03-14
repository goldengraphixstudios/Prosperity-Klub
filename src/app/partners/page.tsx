import Image from "next/image";

import { Container } from "@/components/container";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guidedNotSoldLine, positioningLine } from "@/lib/site";

const partners = [
  {
    logoSrc: "/partners/img-logo.png",
    logoAlt: "IMG logo",
    title: "International Marketing Group",
    type: "Execution Infrastructure",
    description:
      "IMG provides the education system, licensed pathways, and institutional framework that support proper financial execution.",
    note: "Core infrastructure partner behind the Prosperity Klub pathway.",
  },
  {
    logoSrc: "/partners/kaiser.png",
    logoAlt: "Kaiser logo",
    title: "Kaiser International Healthgroup",
    type: "Partner Provider",
    description:
      "Supports health and protection-related planning for members whose goals align with this category.",
    note: "Used when the fit is right for protection and health-related priorities.",
  },
  {
    logoSrc: "/partners/manilabankers.png",
    logoAlt: "Manila Bankers logo",
    title: "Manila Bankers",
    type: "Partner Provider",
    description:
      "Provides access to selected insurance and memorial-related solutions depending on member needs and readiness.",
    note: "A provider option within the broader trusted-institutions network.",
  },
  {
    logoSrc: "/partners/bolt.png",
    logoAlt: "Bolt Assurance logo",
    title: "Bolt Assurance",
    type: "Affiliate / Strategic Access",
    description:
      "Helps support selected insurance quotation pathways when a member needs that type of coverage access.",
    note: "Not pushed by ranking. Used when it matches the situation.",
  },
];

export default function PartnersPage() {
  return (
    <div className="py-20">
      <Container className="space-y-12">
        <FadeIn className="space-y-5">
          <Badge>Partners</Badge>
          <h1 className="max-w-4xl text-4xl font-semibold text-brand-primary">
            Trusted institutions, aligned with your goals.
          </h1>
          <p className="max-w-3xl text-lg text-brand-muted">
            Prosperity Klub is a financial education and guidance platform that helps
            Filipinos navigate trusted institutions with more clarity and context.
          </p>
          <p className="max-w-3xl text-sm text-brand-muted">{positioningLine}</p>
          <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm">
            <p className="font-semibold text-brand-primary">{guidedNotSoldLine}</p>
            <p className="mt-2 text-brand-muted">
              Recommendations are based on fit, not ranking. We use trusted
              institutions when they match your goals, readiness, and priorities.
            </p>
          </div>
        </FadeIn>

        <Stagger className="grid gap-6 md:grid-cols-2">
          {partners.map((partner) => (
            <StaggerItem key={partner.title}>
              <Card className="h-full overflow-hidden border-brand-primary/10 bg-white/90 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
                <CardHeader className="space-y-5">
                  <div className="flex min-h-[110px] items-center justify-center rounded-[24px] border border-brand-primary/10 bg-brand-background px-6 py-5">
                    <Image
                      src={partner.logoSrc}
                      alt={partner.logoAlt}
                      width={220}
                      height={90}
                      className="max-h-[64px] w-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">
                      {partner.type}
                    </p>
                    <CardTitle className="mt-2 text-xl">{partner.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-brand-muted">
                  <p>{partner.description}</p>
                  <div className="rounded-xl border border-brand-primary/10 bg-brand-background p-3 text-xs">
                    {partner.note}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="grid gap-6 lg:grid-cols-2">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>How we use partners responsibly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <p>
                We do not position providers as winners or losers. We evaluate fit
                based on your protection needs, goals, time horizon, and readiness.
              </p>
              <p>
                Some relationships operate as partner access, some as affiliate or
                referral access, and some as strategic alignment through IMG&apos;s
                broader network.
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Why this matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <p>
                Filipinos deserve guidance before execution. That is why Prosperity
                Klub exists: to provide context, mentorship, and a growth environment
                before anyone makes major financial decisions.
              </p>
              <p className="font-semibold text-brand-primary">
                Recommendations are based on fit, not ranking.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
