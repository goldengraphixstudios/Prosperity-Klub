import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  Gift,
  Handshake,
  Home,
  Landmark,
  LineChart,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LinkItem = {
  title: string;
  href: string;
  blurb: string;
  Icon?: React.ComponentType<{ className?: string }>;
  tone?: string;
};

type LinkSection = {
  title: string;
  eyebrow: string;
  description: string;
  items: LinkItem[];
};

const LINK_SECTIONS: LinkSection[] = [
  {
    title: "Partner Institutions",
    eyebrow: "Trusted ecosystem",
    description:
      "These are the organizations and platforms connected to the broader Prosperity Klub pathway.",
    items: [
      {
        title: "International Marketing Group, Corp.",
        href: "https://286898ph.imgcorp.com/",
        blurb: "Financial education infrastructure and partner access pathway.",
        Icon: Handshake,
        tone: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: "Kaiser International Healthgroup, Inc.",
        href: "https://kaiserhealthgroup.com/",
        blurb: "Health and protection-related provider reference.",
        Icon: ShieldCheck,
        tone: "bg-emerald-500/10 text-emerald-700",
      },
      {
        title: "Manila Bankers Life and General Assurance Corp.",
        href: "https://manilabankerslife.com/",
        blurb: "Insurance and long-term protection provider reference.",
        Icon: BriefcaseBusiness,
        tone: "bg-brand-gold/15 text-brand-gold",
      },
      {
        title: "Explore Prosperity Klub on Facebook",
        href: "https://www.facebook.com/prosperityklub",
        blurb: "Community updates, announcements, and trust-building social presence.",
        Icon: FacebookIcon,
        tone: "bg-[#1877F2]/10 text-[#1877F2]",
      },
      {
        title: "Explore Prosperity Klub Realty on Facebook",
        href: "https://www.facebook.com/prosperityklubrealty",
        blurb: "Additional real-estate related community visibility.",
        Icon: Home,
        tone: "bg-brand-secondary/20 text-brand-primary",
      },
    ],
  },
  {
    title: "Quotations and Product Access",
    eyebrow: "Provider links",
    description:
      "Use these after clarity and fit have already been discussed. These links support, not replace, guidance.",
    items: [
      {
        title: "HMO Savings Program",
        href: "https://img.com.ph/quote/UKHB/?agentcode=286898ph",
        blurb: "Health-related quotation path through the IMG ecosystem.",
        Icon: ShieldCheck,
        tone: "bg-emerald-500/10 text-emerald-700",
      },
      {
        title: "Life Insurance + Savings Programs",
        href: "https://286898ph.manilabankerslife.com/app/products/MT18/index.php?fbclid=IwAR0bs8RVgkXrz5O8NjZTvyoX9zdhgvzAxuJ-nB1_shnL92kWZJIg_cPxY3k",
        blurb: "Protection and savings quotation access.",
        Icon: BriefcaseBusiness,
        tone: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: "Funeral & Memorial Plans",
        href: "https://286898ph.manilabankerslife.com/app/products/FIEX/index.php?rand=0.7575737383672756&aff=286898PH",
        blurb: "Burial or cremation planning quotation access.",
        Icon: Handshake,
        tone: "bg-brand-gold/15 text-brand-gold",
      },
      {
        title: "IMG - Bolt Assurance: Motorcar",
        href: "https://286898ph.boltassurance.com/insurance/motorcar/quote01",
        blurb: "Motorcar insurance quotation entry point.",
        Icon: Home,
        tone: "bg-brand-secondary/20 text-brand-primary",
      },
      {
        title: "IMG - Bolt Assurance: Motorcycle",
        href: "https://286898ph.boltassurance.com/insurance/motorcycle/quote01",
        blurb: "Motorcycle insurance quotation entry point.",
        Icon: ArrowUpRight,
        tone: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: "IMG - Bolt Assurance: Fire-property",
        href: "https://286898ph.boltassurance.com/insurance/fire-property",
        blurb: "Property protection quotation access.",
        Icon: Landmark,
        tone: "bg-orange-500/10 text-orange-700",
      },
    ],
  },
  {
    title: "Digital Platforms and Money Tools",
    eyebrow: "Recommended platforms",
    description:
      "These links are useful for digital banking, transfers, and entry-level investing, depending on your goals.",
    items: [
      {
        title: "Wise",
        href: "https://wise.com/invite/ahpn/philipy100",
        blurb: "Online transfers and international money movement features.",
        Icon: Banknote,
        tone: "bg-[#1BB065]/15 text-[#1BB065]",
      },
      {
        title: "Gotrade",
        href: "https://heygotrade.com/referral?code=490789",
        blurb: "US stock investing platform with low entry threshold.",
        Icon: LineChart,
        tone: "bg-brand-gold/15 text-brand-gold",
      },
      {
        title: "OwnBank",
        href: "https://s.ownbank.com.ph/Tc3bw4",
        blurb: "Digital banking offer and financial benefit access.",
        Icon: Landmark,
        tone: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: "Maya",
        href: "https://www.maya.ph/app/registration?invite=@philipianymbong",
        blurb: "Digital wallet and savings-related access.",
        Icon: Wallet,
        tone: "bg-brand-secondary/20 text-brand-primary",
      },
      {
        title: "Maribank",
        href: "https://maribank.ph/c/earnfreemoney?referralCode=PY237960",
        blurb: "Digital banking referral and starter benefit link.",
        Icon: Gift,
        tone: "bg-brand-primary/10 text-brand-primary",
      },
    ],
  },
];

const quickNotes = [
  "Use these links after you understand your priorities.",
  "Recommendations are based on fit, not commissions alone.",
  "Some links are affiliate, referral, or provider access links.",
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M14 9.5h2.3V7h-2.3c-2 0-3.2 1.2-3.2 3.3v1.7H9v2.5h1.8V20h2.6v-5.5h2.3L16 12h-2.4v-1.6c0-.6.3-.9.9-.9Z" />
    </svg>
  );
}

function PlatformCard({ title, href, blurb, Icon, tone }: LinkItem) {
  const IconComponent = Icon ?? ArrowUpRight;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-[1.8rem] border border-brand-primary/10 bg-white/94 p-5 shadow-[0_18px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-brand-primary/20 hover:shadow-[0_24px_45px_rgba(15,23,42,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2"
    >
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              tone ?? "bg-brand-primary/10 text-brand-primary"
            }`}
            aria-hidden="true"
          >
            <IconComponent className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary transition group-hover:text-brand-gold">
            Open
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-primary">{title}</h3>
          <p className="text-sm leading-7 text-brand-muted">{blurb}</p>
        </div>
      </div>
    </a>
  );
}

export default function LinksPage() {
  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#eef3ff_0%,#f7f9ff_35%,#ffffff_100%)] py-16">
      <Container className="space-y-16">
        <FadeIn className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <Badge>Financial Tools &amp; Access</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] text-brand-primary md:text-[3.8rem]">
                Recommended platforms, provider links, and financial access points.
              </h1>
              <p className="max-w-2xl text-lg text-brand-muted">
                This page helps you navigate partner institutions, provider links,
                and selected financial platforms without losing the clarity-first
                Prosperity Klub approach.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <Link href="/book">Book a Free Financial Clarity Session</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resources">Explore the Learning Center</Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-brand-primary/10 bg-white/88">
            <CardHeader className="space-y-3">
              <Badge variant="soft" className="w-fit">
                Before you click anything
              </Badge>
              <CardTitle className="text-2xl">
                Use this page as guided support, not a shortcut around the funnel.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-muted">
              {quickNotes.map((note, index) => (
                <div
                  key={note}
                  className="flex items-start gap-3 rounded-2xl border border-brand-primary/10 bg-brand-background/70 p-4"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p>{note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        <Stagger>
          <div className="grid gap-6 md:grid-cols-3">
            <StaggerItem>
              <Card className="h-full rounded-[1.8rem] bg-white/88">
                <CardHeader>
                  <Badge variant="soft" className="w-fit">
                    Ecosystem
                  </Badge>
                  <CardTitle>Partner institutions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-muted">
                  Learn which organizations support the broader Prosperity Klub
                  ecosystem and what role they play.
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="h-full rounded-[1.8rem] bg-white/88">
                <CardHeader>
                  <Badge variant="soft" className="w-fit">
                    Access
                  </Badge>
                  <CardTitle>Provider links</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-muted">
                  Use direct quotation or provider entry points after clarity and fit
                  have already been discussed.
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="h-full rounded-[1.8rem] bg-white/88">
                <CardHeader>
                  <Badge variant="soft" className="w-fit">
                    Platforms
                  </Badge>
                  <CardTitle>Digital money tools</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-muted">
                  Explore transfer, savings, and entry-level investing platforms
                  that may fit your financial goals.
                </CardContent>
              </Card>
            </StaggerItem>
          </div>
        </Stagger>

        <div className="space-y-12">
          {LINK_SECTIONS.map((section) => (
            <FadeIn key={section.title} className="space-y-6">
              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-secondary">
                  {section.eyebrow}
                </p>
                <h2 className="text-3xl font-semibold text-brand-primary">
                  {section.title}
                </h2>
                <p className="text-brand-muted">{section.description}</p>
              </div>

              <Stagger>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((item) => (
                    <StaggerItem key={item.href}>
                      <PlatformCard {...item} />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="rounded-[2rem] border border-brand-primary/10 bg-brand-primary px-8 py-10 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-secondary">
            Best next step
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Start with clarity before opening accounts, quotes, or referrals.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">
            These platforms are here to support the journey, not replace guidance.
            If you want help understanding what actually fits your priorities, start
            with a Financial Clarity Session.
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
              <Link href="/resources">Explore Resources</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
