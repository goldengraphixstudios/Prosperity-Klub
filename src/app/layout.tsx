import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { Footer } from "@/components/footer";
import { FirstVisitPopup } from "@/components/first-visit-popup";
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
            <FirstVisitPopup />
          </div>
        </SmoothScrollProvider>
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function() {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = "https://embed.tawk.to/69b6cebe22e6fc1c395ad6b1/1jjp1f639";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
