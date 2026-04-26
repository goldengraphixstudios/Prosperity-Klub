"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const questions = [
  "Do you have problem paying your bills?",
  "Do you have problem paying your debts?",
  "Do you work hard but still broke? Is life passing you by?",
  "Are your children growing up faster than you can provide for them?",
  "Do you need to support your aging parent's medical & retirement needs?",
  "Do you frequently argue with your spouse over finances?",
  "Do you have difficulty in saving for your retirement & long-term healthcare?",
  "Are you unhappy with the level of success you have now?",
];

type ResultTier = {
  label: string;
  tone: "green" | "amber" | "red";
  situation: string;
  advice: string;
};

function getResult(yesCount: number): ResultTier {
  if (yesCount === 0) {
    return {
      label: "Strong Financial Position",
      tone: "green",
      situation:
        "You are in a very good situation! You just need to protect what you already have while building wealth.",
      advice:
        "Get into the financial industry & always update your financial strategy!",
    };
  }
  if (yesCount <= 2) {
    return {
      label: "Borderline — Extra Care Needed",
      tone: "amber",
      situation:
        "Your situation is somewhat manageable. You're in the borderline, so you need to be extra careful.",
      advice:
        "Even a small mistake can put you in a difficult situation. Now is the right time to build stronger financial habits.",
    };
  }
  return {
    label: "Challenging — Act With Urgency",
    tone: "red",
    situation: "You are in a very challenging situation.",
    advice:
      "You need to take corrective measures and action with a sense of urgency!",
  };
}

const toneStyles = {
  green: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    panel: "bg-emerald-50 border-emerald-200",
    bar: "bg-emerald-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    panel: "bg-amber-50 border-amber-200",
    bar: "bg-amber-400",
  },
  red: {
    badge: "bg-red-100 text-red-800 border-red-200",
    panel: "bg-red-50 border-red-200",
    bar: "bg-red-500",
  },
};

type Step = "intro" | "quiz" | "email-gate" | "result";

export default function FinancialCheckupClient() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const yesCount = answers.filter(Boolean).length;
  const result = getResult(yesCount);
  const styles = toneStyles[result.tone];

  function handleAnswer(yes: boolean) {
    const updated = [...answers, yes];
    setAnswers(updated);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setStep("email-gate");
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/checkup-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          score: yesCount,
          tier: result.tone,
          tierLabel: result.label,
        }),
      });
      if (!res.ok) throw new Error("Submission failed. Please try again.");
      setStep("result");
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setStep("intro");
    setCurrentQ(0);
    setAnswers([]);
    setName("");
    setEmail("");
    setSubmitError("");
  }

  const progressPct = ((currentQ) / questions.length) * 100;

  return (
    <div className="min-h-screen py-16">
      <Container className="max-w-xl">

        {/* ── Intro ───────────────────────────────────────────────── */}
        {step === "intro" && (
          <FadeIn className="space-y-8">
            <div className="space-y-4">
              <Badge variant="gold">Financial Check-up</Badge>
              <h1 className="text-4xl font-semibold leading-tight text-brand-primary">
                Know Where You Are Now
              </h1>
              <p className="text-lg text-brand-muted">
                8 honest questions. Your real financial situation — revealed.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-[0_4px_20px_rgba(26,54,121,0.07)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-brand-secondary">
                How it works
              </p>
              <ul className="space-y-2.5 text-sm text-brand-muted">
                {[
                  "Answer 8 YES or NO questions based on your current situation",
                  "Your score is calculated instantly",
                  "Drop your email to unlock your full financial picture",
                  "For educational purposes only",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={() => setStep("quiz")}
            >
              Start the Check-up <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        )}

        {/* ── Quiz ────────────────────────────────────────────────── */}
        {step === "quiz" && (
          <FadeIn className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-primary">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-brand-muted">
                  {Math.round(progressPct)}% complete
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-primary/10">
                <div
                  className="h-full rounded-full bg-brand-gold transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-[0_8px_32px_rgba(26,54,121,0.09)]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-secondary">
                What is your situation right now?
              </p>
              <h2 className="mb-8 text-xl font-semibold leading-snug text-brand-primary">
                {questions[currentQ]}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-brand-primary/12 bg-brand-background p-6 text-brand-primary transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <XCircle className="h-10 w-10 text-brand-muted transition-colors duration-200 group-hover:text-red-500" />
                  <span className="text-2xl font-bold tracking-wider">YES</span>
                  <span className="text-xs text-brand-muted">This applies to me</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-brand-primary/12 bg-brand-background p-6 text-brand-primary transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <CheckCircle2 className="h-10 w-10 text-brand-muted transition-colors duration-200 group-hover:text-emerald-500" />
                  <span className="text-2xl font-bold tracking-wider">NO</span>
                  <span className="text-xs text-brand-muted">
                    This doesn&apos;t apply
                  </span>
                </button>
              </div>
            </div>

            {/* Running answer chips */}
            {answers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {answers.map((ans, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      ans
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {ans ? (
                      <XCircle className="h-3 w-3" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    Q{i + 1}
                  </span>
                ))}
              </div>
            )}
          </FadeIn>
        )}

        {/* ── Email Gate ──────────────────────────────────────────── */}
        {step === "email-gate" && (
          <FadeIn className="space-y-7">
            <div className="space-y-3 text-center">
              <Badge variant="gold">Check-up Complete</Badge>
              <h2 className="text-3xl font-semibold text-brand-primary">
                You answered{" "}
                <span className="text-brand-gold">YES to {yesCount}</span> out of 8
                questions.
              </h2>
              <p className="text-brand-muted">
                Drop your email below and we&apos;ll unlock exactly what your score
                means and what your best next step is.
              </p>
            </div>

            {/* Blurred result preview */}
            <div className="relative overflow-hidden rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-[0_4px_20px_rgba(26,54,121,0.08)]">
              <div className="select-none space-y-2 blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Your Situation
                </p>
                <p className="text-lg font-semibold text-brand-primary">
                  ████████ ████████ ████
                </p>
                <p className="text-sm text-brand-muted">
                  ████ ██████ ██ ███ ████ ██████ ████████ ██ ████ ████████
                  ████ ██ ██████ ████.
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                <p className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                  Enter your email to unlock your result
                </p>
              </div>
            </div>

            {/* Email form */}
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-4 rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-[0_4px_20px_rgba(26,54,121,0.08)]"
            >
              <p className="text-sm font-semibold text-brand-primary">
                Get your free financial analysis
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-brand-primary/15 bg-brand-background px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/55 focus:border-brand-primary/35 focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-brand-primary/15 bg-brand-background px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/55 focus:border-brand-primary/35 focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>
              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "See My Financial Situation"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
              <p className="text-center text-xs text-brand-muted">
                No spam. Educational content only. We respect your privacy.
              </p>
            </form>
          </FadeIn>
        )}

        {/* ── Result ──────────────────────────────────────────────── */}
        {step === "result" && (
          <FadeIn className="space-y-7">
            <div className="space-y-3 text-center">
              <Badge variant="gold">Your Result</Badge>
              <h2 className="text-3xl font-semibold text-brand-primary">
                Your Financial Check-up Score
              </h2>
            </div>

            {/* Score card */}
            <div className="space-y-5 rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-[0_8px_32px_rgba(26,54,121,0.10)]">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-secondary">
                    Your Score
                  </p>
                  <p className="mt-1 text-4xl font-bold text-brand-primary">
                    {yesCount}{" "}
                    <span className="text-base font-normal text-brand-muted">
                      YES out of 8
                    </span>
                  </p>
                </div>
                <span
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                >
                  {result.label}
                </span>
              </div>

              {/* Score bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-primary/8">
                  <div
                    className={`h-full rounded-full transition-all ${styles.bar}`}
                    style={{ width: `${(yesCount / 8) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-brand-muted">
                  <span>0 — Strong position</span>
                  <span>8 — Urgent action needed</span>
                </div>
              </div>

              {/* Result panel */}
              <div className={`rounded-2xl border p-5 ${styles.panel}`}>
                <p className="font-semibold text-brand-primary">{result.situation}</p>
                <p className="mt-2 text-sm text-brand-muted">{result.advice}</p>
              </div>

              {/* Answer breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                  Your Answers
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {answers.map((ans, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold ${
                        ans
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {ans ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Q{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA block */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-primary px-8 py-10 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(179,129,36,0.2),transparent)]" />
              <div className="relative space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-secondary">
                  Next Step
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {yesCount === 0
                    ? "Keep growing your financial position."
                    : "Let's build a plan together."}
                </h3>
                <p className="text-sm text-white/70">
                  {yesCount === 0
                    ? "Book a free session to explore how to protect and grow what you already have."
                    : "A free Financial Clarity Session helps you see the right next steps clearly — no pressure."}
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-1">
                  <Button asChild variant="gold">
                    <Link href="/book">Book a Free Clarity Session</Link>
                  </Button>
                  <button
                    type="button"
                    onClick={restart}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white/65 transition hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake Check-up
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-brand-muted">
              For educational purposes only. Exclusively for the internal use of
              Prosperity Klub / IMG.
            </p>
          </FadeIn>
        )}
      </Container>
    </div>
  );
}
