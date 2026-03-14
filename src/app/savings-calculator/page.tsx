"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, PiggyBank, Target, Trophy } from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  solveSavings,
  type DepositTiming,
  type SavingsFrequency,
  type SavingsMode,
  type SavingsResult,
} from "@/lib/savings-calculator";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 2,
});

type FormState = {
  mode: SavingsMode;
  targetAmount: string;
  startingBalance: string;
  regularContribution: string;
  annualRatePct: string;
  years: string;
  frequency: SavingsFrequency;
  timing: DepositTiming;
};

const defaultForm: FormState = {
  mode: "initial",
  targetAmount: "1000000",
  startingBalance: "0",
  regularContribution: "5000",
  annualRatePct: "3.5",
  years: "10",
  frequency: "monthly",
  timing: "end",
};

const modeLabels: Record<SavingsMode, string> = {
  initial: "How much do I need to start with?",
  periodic: "How much do I need to save regularly?",
  time: "How long will it take to reach my target?",
};

export default function SavingsCalculatorPage() {
  const [form, setForm] = React.useState<FormState>(defaultForm);
  const [result, setResult] = React.useState<SavingsResult | null>(() =>
    solveSavings({
      mode: defaultForm.mode,
      targetAmount: toNumber(defaultForm.targetAmount),
      startingBalance: toNumber(defaultForm.startingBalance),
      regularContribution: toNumber(defaultForm.regularContribution),
      annualRatePct: toNumber(defaultForm.annualRatePct),
      years: toNumber(defaultForm.years) || 1,
      frequency: defaultForm.frequency,
      timing: defaultForm.timing,
    })
  );

  const numericTarget = toNumber(form.targetAmount);
  const numericStart = toNumber(form.startingBalance);
  const numericContribution = toNumber(form.regularContribution);
  const numericYears = Math.max(0, toNumber(form.years));
  const numericRate = Math.max(0, toNumber(form.annualRatePct));

  const handleCalculate = () => {
    const computed = solveSavings({
      mode: form.mode,
      targetAmount: numericTarget,
      startingBalance: numericStart,
      regularContribution: numericContribution,
      annualRatePct: numericRate,
      years: numericYears || 1,
      frequency: form.frequency,
      timing: form.timing,
    });
    setResult(computed);
  };

  const displayedStart =
    form.mode === "initial" && result ? numberFormatter.format(result.requiredInitial) : form.startingBalance;
  const displayedContribution =
    form.mode === "periodic" && result
      ? numberFormatter.format(result.requiredContribution)
      : form.regularContribution;
  const displayedYears =
    form.mode === "time" && result
      ? result.targetReached
        ? result.timeYears.toFixed(result.timeYears % 1 === 0 ? 0 : 1)
        : "Not reached"
      : form.years;

  return (
    <div className="bg-brand-primary py-10">
      <Container className="max-w-7xl space-y-8">
        <FadeIn className="space-y-4 text-center text-white">
          <Badge variant="gold">Calculators</Badge>
          <h1 className="text-4xl font-semibold md:text-5xl">Savings Calculator</h1>
          <p className="mx-auto max-w-5xl text-sm leading-7 text-white/78 md:text-base">
            Use this calculator to estimate how much you need to start with, how much
            you need to save regularly, or how long it may take to reach a savings
            goal. It is built for educational planning and strategy conversations.
          </p>
        </FadeIn>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <FadeIn>
            <Card className="border-white/12 bg-white/96 shadow-[0_18px_55px_rgba(9,19,61,0.28)]">
              <CardHeader className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-primary">
                    What do you want to find out?
                  </p>
                  <Select
                    value={form.mode}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, mode: value as SavingsMode }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(modeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="My savings goal (target amount)"
                    icon={<Target className="h-4 w-4" />}
                  >
                    <Input
                      inputMode="decimal"
                      value={form.targetAmount}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, targetAmount: event.target.value }))
                      }
                    />
                  </Field>

                  <Field
                    label="Money I'm starting with"
                    icon={<PiggyBank className="h-4 w-4" />}
                  >
                    <Input
                      inputMode="decimal"
                      value={displayedStart}
                      disabled={form.mode === "initial"}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, startingBalance: event.target.value }))
                      }
                    />
                  </Field>

                  <Field
                    label="Amount I'll save regularly"
                    icon={<PiggyBank className="h-4 w-4" />}
                  >
                    <Input
                      inputMode="decimal"
                      value={displayedContribution}
                      disabled={form.mode === "periodic"}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          regularContribution: event.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field
                    label="How often will I save?"
                    icon={<CalendarClock className="h-4 w-4" />}
                  >
                    <Select
                      value={form.frequency}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          frequency: value as SavingsFrequency,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Every month</SelectItem>
                        <SelectItem value="quarterly">Every quarter</SelectItem>
                        <SelectItem value="yearly">Every year</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Expected annual interest rate"
                    icon={<span className="text-sm font-semibold">%</span>}
                  >
                    <Input
                      inputMode="decimal"
                      value={form.annualRatePct}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, annualRatePct: event.target.value }))
                      }
                    />
                  </Field>

                  <Field
                    label="How long will I save?"
                    icon={<CalendarClock className="h-4 w-4" />}
                  >
                    <Input
                      inputMode="decimal"
                      value={displayedYears}
                      disabled={form.mode === "time"}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, years: event.target.value }))
                      }
                    />
                  </Field>
                </div>

                <Field
                  label="When will I make deposits?"
                  icon={<CalendarClock className="h-4 w-4" />}
                >
                  <Select
                    value={form.timing}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, timing: value as DepositTiming }))
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="end">At the end of each period</SelectItem>
                      <SelectItem value="beginning">At the beginning of each period</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="gold"
                    className="h-13 rounded-full px-8 text-base shadow-[0_12px_30px_rgba(179,129,36,0.35)]"
                    onClick={handleCalculate}
                  >
                    Calculate My Savings Plan
                  </Button>
                  <Button asChild variant="outline" className="h-13 rounded-full px-8">
                    <Link href="/book">Talk to a Financial Advisor</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
              <Card className="border-white/12 bg-white/96">
                <CardContent className="space-y-4 p-6 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-brand-gold" />
                  <p className="text-2xl font-semibold leading-tight text-[#12945a]">
                    {getHeadline(result, form.mode)}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {getSubcopy(result, form)}
                  </p>
                  {result && (
                    <div className="space-y-3 rounded-2xl bg-brand-background p-4 text-left text-sm">
                      <SummaryRow
                        label="Initial Balance"
                        value={currencyFormatter.format(result.requiredInitial)}
                      />
                      <SummaryRow
                        label="Total Deposits"
                        value={currencyFormatter.format(result.totalDeposits)}
                      />
                      <SummaryRow
                        label="Interest Earned"
                        value={currencyFormatter.format(result.interestEarned)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/12 bg-white/96">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-xl">
                    Final Balance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SavingsPieChart result={result} />
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/12 bg-white/96">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-xl">
                  Savings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SavingsStackedChart result={result} />
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="overflow-x-auto rounded-[28px] border border-white/12 bg-white/96 shadow-[0_18px_55px_rgba(9,19,61,0.22)]">
            <table className="min-w-[960px] w-full text-left">
              <thead className="bg-black/4 text-sm text-brand-primary">
                <tr>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Periodic Deposits</th>
                  <th className="px-6 py-4">Total Deposits</th>
                  <th className="px-6 py-4">Total Interest</th>
                  <th className="px-6 py-4">Balance</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-text">
                {result?.breakdown.map((row, index) => (
                  <tr key={`${row.yearLabel}-${index}`} className="border-t border-black/5 even:bg-black/[0.03]">
                    <td className="px-6 py-3">Year {row.yearLabel}</td>
                    <td className="px-6 py-3">{currencyFormatter.format(row.periodicDeposits)}</td>
                    <td className="px-6 py-3">{currencyFormatter.format(row.totalDeposits)}</td>
                    <td className="px-6 py-3">{currencyFormatter.format(row.totalInterest)}</td>
                    <td className="px-6 py-3">{currencyFormatter.format(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/12 bg-white/96">
            <CardHeader>
              <CardTitle>How to use this calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Select what you want to solve for.</li>
                <li>Enter your goal, timing, contribution pattern, and expected rate.</li>
                <li>Review the balance breakdown, yearly table, and savings mix.</li>
                <li>Use the output to support a real planning conversation.</li>
              </ol>
              <p className="rounded-xl border border-brand-primary/10 bg-brand-background p-3 text-xs">
                Educational note: this tool is for educational planning purposes only.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/12 bg-white/96">
            <CardHeader>
              <CardTitle>Need help interpreting the result?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-muted">
              <p>
                A calculator can show scenarios, but it cannot replace context.
                Book a clarity session if you want help deciding whether the target,
                contribution level, or timeline fits your real life.
              </p>
              <Button asChild variant="gold">
                <Link href="/book">Book a Free Financial Clarity Session</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-semibold text-brand-primary">{label}:</span>
      <span className="font-semibold text-[#12945a]">{value}</span>
    </div>
  );
}

function SavingsPieChart({ result }: { result: SavingsResult | null }) {
  const total =
    (result?.requiredInitial ?? 0) +
    (result?.periodicDeposits ?? 0) +
    (result?.interestEarned ?? 0);

  const slices = [
    {
      label: "Initial Balance",
      value: result?.requiredInitial ?? 0,
      color: "#5aa4dd",
    },
    {
      label: "Periodic Deposits",
      value: result?.periodicDeposits ?? 0,
      color: "#56bb77",
    },
    {
      label: "Interest Earned",
      value: result?.interestEarned ?? 0,
      color: "#f4b03a",
    },
  ];

  let offset = 0;
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg viewBox="0 0 180 180" className="h-[220px] w-[220px]">
          <circle cx="90" cy="90" r="70" fill="#f7f8fb" />
          {slices.map((slice) => {
            const dash = total > 0 ? (slice.value / total) * circumference : 0;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle
                key={slice.label}
                cx="90"
                cy="90"
                r="70"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="140"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                transform="rotate(-90 90 90)"
              />
            );
          })}
          <circle cx="90" cy="90" r="42" fill="white" />
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-muted">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span>{slice.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsStackedChart({ result }: { result: SavingsResult | null }) {
  const rows = result?.breakdown ?? [];
  const maxValue = Math.max(1, ...rows.map((row) => row.balance));

  return (
    <div className="space-y-4">
      <div className="grid h-[260px] grid-cols-[60px_1fr] gap-4">
        <div className="flex flex-col justify-between pb-8 text-xs text-brand-muted">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <span key={ratio}>{currencyFormatter.format(maxValue * ratio)}</span>
          ))}
        </div>
        <div className="grid grid-cols-10 gap-3 border-l border-b border-black/8 px-3 pb-8">
          {rows.map((row) => {
            const initialHeight = (row.totalDeposits - row.periodicDeposits) / maxValue;
            const periodicHeight = row.periodicDeposits / maxValue;
            const interestHeight = row.totalInterest / maxValue;

            return (
              <div key={row.yearLabel} className="flex flex-col items-center justify-end gap-3">
                <div className="flex h-full w-full max-w-[42px] flex-col justify-end overflow-hidden rounded-t-md bg-black/[0.03]">
                  <div
                    style={{ height: `${initialHeight * 100}%`, backgroundColor: "#5aa4dd" }}
                  />
                  <div
                    style={{ height: `${periodicHeight * 100}%`, backgroundColor: "#56bb77" }}
                  />
                  <div
                    style={{ height: `${interestHeight * 100}%`, backgroundColor: "#f4b03a" }}
                  />
                </div>
                <span className="text-xs text-brand-muted">Year {row.yearLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-muted">
        {[
          { label: "Initial Balance", color: "#5aa4dd" },
          { label: "Periodic Deposits", color: "#56bb77" },
          { label: "Interest Earned", color: "#f4b03a" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-7 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getHeadline(result: SavingsResult | null, mode: SavingsMode) {
  if (!result) return "Run the calculator";
  if (mode === "initial") {
    return `You need an initial balance of ${currencyFormatter.format(result.requiredInitial)}`;
  }
  if (mode === "periodic") {
    return `You need to save ${currencyFormatter.format(result.requiredContribution)} regularly`;
  }
  if (!result.targetReached) {
    return "The target was not reached within 80 years";
  }
  return `You can reach your goal in ${result.timeYears.toFixed(
    result.timeYears % 1 === 0 ? 0 : 1
  )} years`;
}

function getSubcopy(result: SavingsResult | null, form: FormState) {
  if (!result) return "";
  if (form.mode === "initial") {
    return `to reach your target by saving ${currencyFormatter.format(
      toNumber(form.regularContribution)
    )} ${
      form.frequency === "monthly"
        ? "monthly"
        : form.frequency === "quarterly"
          ? "quarterly"
          : "yearly"
    } for ${form.years} years`;
  }
  if (form.mode === "periodic") {
    return `to reach ${currencyFormatter.format(
      toNumber(form.targetAmount)
    )} in ${form.years} years`;
  }
  return `with a starting balance of ${currencyFormatter.format(
    toNumber(form.startingBalance)
  )} and ${currencyFormatter.format(toNumber(form.regularContribution))} added regularly`;
}

function toNumber(value: string) {
  const normalized = value.replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
