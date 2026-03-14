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

const expectations = [
  "A conversation centered on your goals, not a scripted sales pitch",
  "Clear next-step guidance based on your priorities and readiness",
  "Direction on whether membership, education, or a provider pathway fits best",
];

export default function BookPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <FadeIn className="max-w-4xl space-y-4">
          <Badge>Book</Badge>
          <h1 className="text-3xl font-semibold text-brand-primary md:text-4xl">
            Book a Free Financial Clarity Session
          </h1>
          <p className="text-sm text-brand-muted md:text-base">
            This is the best place to start if you want guidance, not guesswork.
          </p>
          <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-primary">Guided, not sold.</p>
            <p className="mt-2">{guidedNotSoldLine}</p>
            <p className="mt-2">
              The goal of this session is to help you understand your next best move,
              not pressure you into one.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="space-y-1">
              <CardTitle>Schedule your session</CardTitle>
              <p className="text-sm text-brand-muted">
                The calendar loads below. If it doesn&apos;t appear, use the button
                to open it in a new tab.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-brand-primary/10 bg-white">
                <iframe
                  src="https://calendly.com/philipianymbong/free-consultation"
                  title="Calendly Booking"
                  className="h-[640px] w-full"
                />
              </div>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a
                  href="https://calendly.com/philipianymbong/free-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open booking in new tab
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>What to expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-brand-muted">
                {expectations.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                      {index + 1}
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Need help first?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-brand-muted">
                <p>
                  Prefer to chat before booking? Reach out and we&apos;ll guide you to
                  the best next step.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="gold">
                    <a
                      href="https://api.whatsapp.com/send?phone=639308525204"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Message on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="mailto:philipianymbong@gmail.com">Email Us</a>
                  </Button>
                </div>
                <p className="text-xs text-brand-primary">
                  Social proof: most people start here when they want clarity before
                  making financial decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold text-brand-primary">Booking FAQ</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this a sales call?</AccordionTrigger>
              <AccordionContent>
                No. This session is designed to clarify your goals and suggest the
                most relevant next steps.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Who is this session for?</AccordionTrigger>
              <AccordionContent>
                Filipinos and OFWs who want help understanding protection,
                savings, investment direction, or membership fit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens after I book?</AccordionTrigger>
              <AccordionContent>
                You receive the booked session schedule, then we use that conversation
                to map your next step inside the Prosperity Klub journey.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FadeIn>
      </Container>
    </div>
  );
}
