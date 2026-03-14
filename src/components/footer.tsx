import Link from "next/link";
import { Globe, Mail, MessageCircle, Phone, Users } from "lucide-react";

import { guidedNotSoldLine, positioningLine, siteConfig } from "@/lib/site";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-brand-primary/10 bg-white/80 py-10">
      <Container className="flex flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-brand-primary">
              Prosperity Klub
            </p>
            <p className="max-w-sm text-sm text-brand-muted">
              {positioningLine}
            </p>
            <p className="max-w-sm text-xs uppercase tracking-[0.24em] text-brand-secondary">
              Guided, not sold.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-brand-primary">
            {siteConfig.footerNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-gold">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-brand-primary">Connect</p>
            <p className="max-w-xs text-xs text-brand-muted">{guidedNotSoldLine}</p>
            <div className="flex items-center gap-3 text-brand-muted">
              <a
                href="https://www.facebook.com/prosperityklub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full p-2 transition hover:bg-brand-primary/10"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=639308525204"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full p-2 transition hover:bg-brand-primary/10"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="mailto:philipianymbong@gmail.com"
                aria-label="Email"
                className="rounded-full p-2 transition hover:bg-brand-primary/10"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="px-3">
                <a
                  href="https://www.messenger.com/t/4195348993870330"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Messenger Group
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="px-3">
                <a
                  href="https://chat.whatsapp.com/G3QCZqVdht78Xu1VjsO8Pe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="h-4 w-4" />
                  WhatsApp Group
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-brand-primary/10 pt-6 text-xs text-brand-muted md:flex-row md:items-center md:justify-between">
          <span>(c) {new Date().getFullYear()} Prosperity Klub. All rights reserved.</span>
          <span>Educational content only. Not financial, legal, or tax advice.</span>
        </div>
      </Container>
    </footer>
  );
}
