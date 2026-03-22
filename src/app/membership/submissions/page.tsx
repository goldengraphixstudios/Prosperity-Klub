"use client";

import Link from "next/link";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembershipSubmissionsPage() {
  return (
    <div className="py-12">
      <Container className="space-y-6">
        <FadeIn className="space-y-2">
          <Badge>Admin Note</Badge>
          <h1 className="text-3xl font-semibold text-brand-primary">
            Membership Submission Handling
          </h1>
          <p className="text-sm text-brand-muted">
            Membership registrations are no longer stored in this browser.
          </p>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle className="text-base">Current setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-muted">
              <p>
                The Ipon Challenge registration form now submits through Formspree,
                and the Full Access path redirects to the official Google Form.
              </p>
              <p>
                If you need an internal admin dashboard later, the next step is to
                connect submissions to a database or CRM instead of local browser
                storage.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/membership">Back to Membership</Link>
                </Button>
                <Button asChild variant="gold">
                  <Link href="/contact">Open Contact Form</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
