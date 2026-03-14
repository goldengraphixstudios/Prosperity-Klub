import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="max-w-3xl space-y-6">
          <Badge>Disclosure</Badge>
          <h1 className="text-4xl font-semibold text-brand-primary">
            Affiliate Disclosure
          </h1>
          <p className="text-brand-muted">
            Some links on this website may be affiliate, referral, or partner links.
            That means Prosperity Klub may receive compensation, referral credit, or
            business benefit if you proceed through certain links or provider
            pathways.
          </p>
          <p className="text-brand-muted">
            This does not change our core principle: recommendations are based on fit,
            not ranking, and guidance is intended to start with your goals before any
            execution path is considered.
          </p>
          <p className="text-brand-muted">
            If a link supports a commercial relationship, Prosperity Klub aims to
            present that relationship transparently while still prioritizing clarity,
            suitability, and responsible education.
          </p>
        </FadeIn>
      </Container>
    </div>
  );
}
