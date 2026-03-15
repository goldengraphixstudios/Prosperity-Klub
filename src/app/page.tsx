import type { Metadata } from "next";

import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Financial Education & Wealth Planning Community in the Philippines",
  description:
    "Prosperity Klub is a financial education, guidance, and wealth-building community for Filipinos and OFWs seeking smarter money decisions, protection, and long-term growth.",
};

export default function HomePage() {
  return <HomePageClient />;
}
