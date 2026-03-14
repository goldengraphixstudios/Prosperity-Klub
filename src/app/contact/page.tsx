import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/lead-form";

export default function ContactPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <Badge>Contact</Badge>
            <h1 className="text-4xl font-semibold text-brand-primary">
              Start with clarity.
            </h1>
            <p className="text-lg text-brand-muted">
              Share a few details and we will reach out within 24 hours.
            </p>
            <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
              <p className="font-semibold text-brand-primary">
                The more details you provide, the better we can guide you.
              </p>
              <p className="mt-2">
                We use your answers to understand your priorities, segment your needs,
                and respond with the most relevant next step.
              </p>
              <p className="mt-2">
                Your information is used for follow-up and guidance only.
              </p>
            </div>
          </div>

          <Card className="border-brand-primary/10 bg-white/80">
            <CardContent className="p-8">
              <LeadForm />
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
