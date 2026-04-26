import type { Metadata } from "next";

import FinancialCheckupClient from "./financial-checkup-client";

export const metadata: Metadata = {
  title: "Free Financial Check-up",
  description:
    "Answer 8 honest YES or NO questions and find out exactly where you stand financially. Drop your email to unlock your free financial situation analysis.",
};

export default function FinancialCheckupPage() {
  return <FinancialCheckupClient />;
}
