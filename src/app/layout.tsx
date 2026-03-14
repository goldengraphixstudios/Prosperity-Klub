import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/motion";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { withBasePath } from "@/lib/utils";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prosperity Klub",
    template: "%s | Prosperity Klub",
  },
  description:
    "Prosperity Klub is a financial growth community under International Marketing Group (IMG), helping Filipinos build protection, wealth, and diversified income opportunities.",
  icons: {
    icon: withBasePath("/brand/logo-update.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <SmoothScrollProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
