import Link from "next/link";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-4xl font-semibold text-brand-primary">
            Thank you for reaching out.
          </h1>
          <p className="text-lg text-brand-muted">
            We will contact you within 24 hours.
          </p>
          <Button asChild variant="gold" className="mx-auto hover:scale-[1.02]">
            <Link href="/book">Book a Call</Link>
          </Button>
        </FadeIn>
      </Container>
    </div>
  );
}
