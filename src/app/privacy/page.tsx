import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="max-w-3xl space-y-6">
          <Badge>Privacy</Badge>
          <h1 className="text-4xl font-semibold text-brand-primary">Privacy Policy</h1>
          <p className="text-brand-muted">
            Prosperity Klub collects the information you voluntarily submit through
            forms, bookings, downloads, and communication channels. We use that data
            to respond to inquiries, provide educational guidance, improve your
            experience, and support follow-up related to your goals.
          </p>
          <p className="text-brand-muted">
            Information may be stored in secure internal systems, browser storage,
            trusted scheduling tools, or partner platforms that help us deliver a
            consistent guidance experience.
          </p>
          <p className="text-brand-muted">
            We do not sell your personal information. We may use trusted providers or
            platforms to process communications, scheduling, or execution-related
            workflows where appropriate.
          </p>
          <p className="text-brand-muted">
            By submitting forms on this site, you consent to being contacted regarding
            your inquiry, education journey, or relevant next steps inside Prosperity
            Klub.
          </p>
        </FadeIn>
      </Container>
    </div>
  );
}
