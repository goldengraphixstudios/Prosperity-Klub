import * as React from "react";
import Link from "next/link";
import {
  Gift,
  Home,
  Landmark,
  LineChart,
  MoreVertical,
  Wallet,
  Banknote,
} from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

type LinkItem = {
  title: string;
  href: string;
  Icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
};

type LinkSection = {
  title: string;
  items: LinkItem[];
};

const LINK_SECTIONS: LinkSection[] = [
  {
    title: "Providers",
    items: [
      {
        title: "International Marketing Group, Corp.",
        href: "https://286898ph.imgcorp.com/",
      },
      {
        title: "Kaiser International Healthgroup, Inc.",
        href: "https://kaiserhealthgroup.com/",
      },
      {
        title: "Manila Bankers Life and General Assurance Corp.",
        href: "https://manilabankerslife.com/",
      },
      {
        title: "Explore Prosperity Klub on Facebook",
        href: "https://www.facebook.com/prosperityklub",
        Icon: FacebookIcon,
        iconBg: "bg-[#1877F2]/10 text-[#1877F2]",
      },
      {
        title: "Explore Prosperity Klub Realty on Facebook",
        href: "https://www.facebook.com/prosperityklubrealty",
        Icon: Home,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
    ],
  },
  {
    title: "FREE QUOTATIONS",
    items: [
      {
        title: "HMO Savings Program",
        href: "https://img.com.ph/quote/UKHB/?agentcode=286898ph",
      },
      {
        title: "Life Insurance + Savings Programs",
        href: "https://286898ph.manilabankerslife.com/app/products/MT18/index.php?fbclid=IwAR0bs8RVgkXrz5O8NjZTvyoX9zdhgvzAxuJ-nB1_shnL92kWZJIg_cPxY3k",
      },
      {
        title: "Funeral & Memorial Plans (Burial or cremation options)",
        href: "https://286898ph.manilabankerslife.com/app/products/FIEX/index.php?rand=0.7575737383672756&aff=286898PH",
      },
      {
        title: "IMG - Bolt Assurance: Motorcar",
        href: "https://286898ph.boltassurance.com/insurance/motorcar/quote01",
      },
      {
        title: "IMG - Bolt Assurance: Motorcycle",
        href: "https://286898ph.boltassurance.com/insurance/motorcycle/quote01",
      },
      {
        title: "IMG - Bolt Assurance: Fire-property",
        href: "https://286898ph.boltassurance.com/insurance/fire-property",
      },
    ],
  },
  {
    title: "Digital Banks and Investment",
    items: [
      {
        title: "Wise: Online Money Transfers | International Banking Features",
        href: "https://wise.com/invite/ahpn/philipy100",
        Icon: Banknote,
        iconBg: "bg-[#1BB065]/15 text-[#1BB065]",
      },
      {
        title: "Join us on Gotrade where you can invest US Stocks starting with $1",
        href: "https://heygotrade.com/referral?code=490789",
        Icon: LineChart,
        iconBg: "bg-brand-gold/15 text-brand-gold",
      },
      {
        title: "Get 8% Exclusive Financial Benefits from OwnBank",
        href: "https://s.ownbank.com.ph/Tc3bw4",
        Icon: Landmark,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
      {
        title: "Get P50 in MAYA plus up to 15% interest p.a. here",
        href: "https://www.maya.ph/app/registration?invite=@philipianymbong",
        Icon: Wallet,
        iconBg: "bg-brand-secondary/20 text-brand-primary",
      },
      {
        title: "Get P150 now by signing up with Maribank",
        href: "https://maribank.ph/c/earnfreemoney?referralCode=PY237960",
        Icon: Gift,
        iconBg: "bg-brand-primary/10 text-brand-primary",
      },
    ],
  },
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

function LinkCard({ title, href, Icon, iconBg }: LinkItem) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-4 rounded-[26px] border border-white/60 bg-white/95 px-5 py-4 text-left shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2"
      aria-label={`${title} (opens in new tab)`}
    >
      {Icon ? (
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            iconBg ?? "bg-brand-primary/10 text-brand-primary"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : (
        <span className="h-10 w-10" aria-hidden="true" />
      )}
      <span className="flex-1 text-sm font-semibold text-brand-primary md:text-base">
        {title}
      </span>
      <span className="sr-only">Opens in a new tab</span>
      <MoreVertical className="h-5 w-5 text-brand-muted/60" aria-hidden="true" />
    </a>
  );
}

function LinkSection({ title, items }: LinkSection) {
  return (
    <section className="space-y-4">
      <h2 className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <LinkCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  );
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7fb7c7]/60 via-[#a7d0dc]/40 to-white py-14">
      <Container className="max-w-[720px] px-4 sm:px-6">
        <FadeIn className="space-y-10">
          <div className="space-y-3 text-center">
            <Badge>Links Hub</Badge>
            <h1 className="text-3xl font-semibold text-brand-primary">
              Links Hub
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-brand-muted md:text-base">
              Use these links after you understand your priorities. This page supports
              the Prosperity Klub journey, but it should not replace proper
              qualification, guidance, or a clarity session.
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-secondary">
              Transparency note: some links may be affiliate or referral links.
            </p>
          </div>

          <div className="space-y-10">
            {LINK_SECTIONS.map((section) => (
              <LinkSection key={section.title} {...section} />
            ))}
          </div>

          <div className="text-center text-xs text-brand-muted">
            Start with guidance first. Book a{" "}
            <Link href="/book" className="text-brand-primary hover:text-brand-gold">
              Free Financial Clarity Session
            </Link>{" "}
            or visit our{" "}
            <Link href="/resources" className="text-brand-primary hover:text-brand-gold">
              Resources
            </Link>{" "}
            page.
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
