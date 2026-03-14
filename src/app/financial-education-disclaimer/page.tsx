import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export default function FinancialEducationDisclaimerPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="max-w-3xl space-y-6">
          <Badge>Disclaimer</Badge>
          <h1 className="text-4xl font-semibold text-brand-primary">
            Financial Education Disclaimer
          </h1>
          <p className="text-brand-muted">
            Prosperity Klub exists to provide financial education, guidance, and
            community support. Information shared on this website, in resources, or in
            sessions is educational and should not be treated as individualized
            financial advice.
          </p>
          <p className="text-brand-muted">
            Financial products, investments, insurance, and provider pathways carry
            risks, costs, and suitability considerations. You should evaluate each
            decision carefully and consult licensed or regulated professionals when
            needed.
          </p>
          <p className="text-brand-muted">
            Calculator outputs, examples, and scenarios are simplified tools intended
            to help with understanding. They are not guarantees of performance,
            approval, outcomes, or future results.
          </p>
        </FadeIn>
      </Container>
    </div>
  );
}
