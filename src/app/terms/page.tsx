import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="max-w-3xl space-y-6">
          <Badge>Terms</Badge>
          <h1 className="text-4xl font-semibold text-brand-primary">
            Terms & Disclaimer
          </h1>
          <p className="text-brand-muted">
            Prosperity Klub provides educational content, guidance, and community
            support. Content on this site is intended for informational and
            educational purposes only.
          </p>
          <p className="text-brand-muted">
            Nothing on this site should be interpreted as guaranteed financial
            results, personalized legal advice, tax advice, or a substitute for
            regulated professional advice.
          </p>
          <p className="text-brand-muted">
            Where financial products or institutions are discussed, execution may be
            handled through trusted partners, provider platforms, or IMG-supported
            infrastructure. Recommendations depend on fit, readiness, and the facts of
            your situation.
          </p>
          <p className="text-brand-muted">
            By using this website, downloading resources, or submitting a form, you
            acknowledge that your decisions remain your responsibility and should be
            reviewed carefully before execution.
          </p>
        </FadeIn>
      </Container>
    </div>
  );
}
