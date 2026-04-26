"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "pk-checkup-seen";

export function FirstVisitPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="popup-heading"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-brand-primary/10 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.24)]">
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-gold to-brand-secondary" />

              <div className="p-8">
                {/* Close button */}
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Close"
                  className="absolute right-4 top-[1.6rem] rounded-lg p-1.5 text-brand-muted transition hover:bg-brand-primary/8 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-5">
                  {/* Header */}
                  <div className="space-y-3">
                    <Badge variant="gold">Free Financial Check-up</Badge>
                    <h2
                      id="popup-heading"
                      className="text-2xl font-semibold leading-snug text-brand-primary"
                    >
                      Know where you stand financially — in 2 minutes.
                    </h2>
                    <p className="text-sm leading-relaxed text-brand-muted">
                      Answer 8 honest YES or NO questions and find out exactly
                      what your financial situation looks like right now.
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 text-sm text-brand-muted">
                    {[
                      "8 quick YES or NO questions",
                      "Instantly scored based on your answers",
                      "Free — drop your email to unlock your result",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <Button
                      asChild
                      variant="gold"
                      className="w-full"
                      onClick={dismiss}
                    >
                      <Link href="/resources/financial-checkup">
                        Take the Free Check-up{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="text-center text-sm text-brand-muted transition hover:text-brand-primary"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
