
"use client";

import * as React from "react";
import Link from "next/link";

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
import { Container } from "@/components/container";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { SimpleLineChart } from "@/components/charts/simple-line-chart";
import {
  applyRounding,
  type ConsolidationSettings,
  type DebtInput,
  type RoundingOption,
  type Settings,
  simulateAvalanche,
  simulateConsolidation,
  simulateSnowball,
} from "@/lib/debt-strategies";

type DebtRow = {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
};

const emptyDebt: DebtRow = {
  id: "",
  name: "",
  balance: "",
  apr: "",
  minPayment: "",
};

type SettingsForm = {
  extraMonthly: string;
  capMonths: string;
  rounding: RoundingOption;
};

type ConsolidationForm = {
  enabled: boolean;
  apr: string;
  termMonths: string;
  originationFeePct: string;
  fixedFees: string;
  financeFees: "finance" | "upfront";
  collateralType: string;
  appraisedValue: string;
  maxLtvPct: string;
};

const storageKey = "pk_debt_strategies_v1";

const defaultSettings: SettingsForm = {
  extraMonthly: "2000",
  capMonths: "600",
  rounding: "none",
};

const defaultConsolidation: ConsolidationForm = {
  enabled: true,
  apr: "12",
  termMonths: "36",
  originationFeePct: "1",
  fixedFees: "0",
  financeFees: "finance",
  collateralType: "Vehicle (OR/CR)",
  appraisedValue: "0",
  maxLtvPct: "70",
};

const sampleSettings: SettingsForm = {
  extraMonthly: "3000",
  capMonths: "600",
  rounding: "none",
};

const sampleConsolidation: ConsolidationForm = {
  enabled: true,
  apr: "14",
  termMonths: "12",
  originationFeePct: "1.2",
  fixedFees: "2500",
  financeFees: "finance",
  collateralType: "Vehicle (OR/CR)",
  appraisedValue: "300000",
  maxLtvPct: "80",
};

const sampleDebts: DebtRow[] = [
  {
    id: "sample-1",
    name: "BDO Credit Card",
    balance: "48250",
    apr: "28",
    minPayment: "2400",
  },
  {
    id: "sample-2",
    name: "Shopee/Lazada Card",
    balance: "18800",
    apr: "32",
    minPayment: "1200",
  },
  {
    id: "sample-3",
    name: "Salary Loan",
    balance: "35000",
    apr: "24",
    minPayment: "2200",
  },
  {
    id: "sample-4",
    name: "Motorcycle Loan",
    balance: "78000",
    apr: "18",
    minPayment: "4200",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 2,
});

function formatPHP(value: number) {
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toPositiveNumber(value: string) {
  return Math.max(0, toNumber(value));
}

function toPositiveInt(value: string, fallback = 0) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell ?? "");
          if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
            return `"${text.replace(/\"/g, "\"\"")}"`;
          }
          return text;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function DebtStrategiesPage() {
  const [debts, setDebts] = React.useState<DebtRow[]>([]);
  const [newDebt, setNewDebt] = React.useState<DebtRow>(emptyDebt);
  const [settings, setSettings] = React.useState<SettingsForm>(defaultSettings);
  const [consolidation, setConsolidation] =
    React.useState<ConsolidationForm>(defaultConsolidation);
  const [calcTrigger, setCalcTrigger] = React.useState(0);

  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        debts?: DebtRow[];
        settings?: SettingsForm;
        consolidation?: ConsolidationForm;
      };
      if (parsed.debts) setDebts(parsed.debts);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.consolidation) setConsolidation(parsed.consolidation);
    } catch {
      return;
    }
  }, []);

  const debtInputs = React.useMemo<DebtInput[]>(() => {
    return debts.map((debt, index) => ({
      id: debt.id,
      name: debt.name.trim() || `Debt ${index + 1}`,
      balance: toPositiveNumber(debt.balance),
      apr: Math.max(0, toNumber(debt.apr)),
      minPayment: toPositiveNumber(debt.minPayment),
    }));
  }, [debts]);

  const strategySettings = React.useMemo<Settings>(() => {
    return {
      extraMonthly: toPositiveNumber(settings.extraMonthly),
      capMonths: Math.max(1, toPositiveInt(settings.capMonths, 600) || 600),
      rounding: settings.rounding,
    };
  }, [settings]);

  const consolidationSettings = React.useMemo<ConsolidationSettings>(() => {
    return {
      enabled: consolidation.enabled,
      apr: Math.max(0, toNumber(consolidation.apr)),
      termMonths: Math.max(1, toPositiveInt(consolidation.termMonths, 36)),
      originationFeePct: Math.max(0, toNumber(consolidation.originationFeePct)),
      fixedFees: toPositiveNumber(consolidation.fixedFees),
      financeFees: consolidation.financeFees,
      collateralType: consolidation.collateralType,
      appraisedValue: toPositiveNumber(consolidation.appraisedValue),
      maxLtvPct: Math.max(0, toNumber(consolidation.maxLtvPct)),
    };
  }, [consolidation]);

  const { snowball, avalanche, consolidationResult } = React.useMemo(() => {
    void calcTrigger;
    return {
      snowball: simulateSnowball(debtInputs, strategySettings),
      avalanche: simulateAvalanche(debtInputs, strategySettings),
      consolidationResult: simulateConsolidation(
        debtInputs,
        strategySettings,
        consolidationSettings
      ),
    };
  }, [debtInputs, strategySettings, consolidationSettings, calcTrigger]);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const snow = snowball.balanceSeries;
    const aval = avalanche.balanceSeries;
    if (!snow.length || !aval.length) return;
    const minLen = Math.min(snow.length, aval.length);
    let identical = true;
    for (let i = 0; i < minLen; i += 1) {
      if (Math.abs((snow[i] ?? 0) - (aval[i] ?? 0)) > 0.01) {
        identical = false;
        break;
      }
    }
    if (identical) {
      console.warn(
        "[Debt Strategies] Snowball and Avalanche balance series are identical. Verify inputs/payoff order."
      );
    }
  }, [snowball.balanceSeries, avalanche.balanceSeries]);

  const totalBalance = React.useMemo(
    () => debtInputs.reduce((total, debt) => total + debt.balance, 0),
    [debtInputs]
  );

  const hasDebts = debtInputs.length > 0;

  const totalMinPayment = React.useMemo(
    () => debtInputs.reduce((total, debt) => total + debt.minPayment, 0),
    [debtInputs]
  );

  const ltvLimit = React.useMemo(() => {
    return consolidationSettings.appraisedValue * (consolidationSettings.maxLtvPct / 100);
  }, [consolidationSettings]);

  const financedPrincipal = React.useMemo(() => {
    const basePrincipal = totalBalance;
    const fees =
      basePrincipal * (consolidationSettings.originationFeePct / 100) +
      consolidationSettings.fixedFees;
    return consolidationSettings.financeFees === "finance"
      ? basePrincipal + fees
      : basePrincipal;
  }, [consolidationSettings, totalBalance]);

  const eligibilityReason = React.useMemo(() => {
    if (!consolidationSettings.enabled) {
      return "Consolidation is disabled.";
    }
    if (totalBalance <= 0) {
      return "Add balances to evaluate eligibility.";
    }
    if (consolidationSettings.appraisedValue <= 0 || consolidationSettings.maxLtvPct <= 0) {
      return "Provide collateral value and LTV to check eligibility.";
    }
    if (!consolidationResult.eligible) {
      return "Collateral LTV is not sufficient for the financed principal.";
    }
    return "Eligible based on the provided collateral and LTV.";
  }, [consolidationResult.eligible, consolidationSettings, totalBalance]);

  const payoffOrderText = (result: typeof snowball) => {
    if (!result.payoffOrder.length) return "Payoff Order: -";
    return `Payoff Order: ${result.payoffOrder
      .map((item) => `Month ${item.month}: ${item.name}`)
      .join("  ")}`;
  };

  const amortizationRows = (result: typeof snowball) => {
    return [
      ["Month", "Payment", "Interest", "Principal", "Balance"],
      ...result.amortization.map((row) => [
        row.month,
        row.payment.toFixed(2),
        row.interest.toFixed(2),
        row.principal.toFixed(2),
        row.balance.toFixed(2),
      ]),
    ];
  };

  const statusText = (result: typeof snowball) => {
    if (result.capped) {
      return `Capped at ${strategySettings.capMonths} months`;
    }
    if (!result.months) return "No payoff yet";
    return `${result.months} months`;
  };

  const consStatusText = () => {
    if (!consolidationResult.eligible) {
      return "Not eligible";
    }
    if (consolidationResult.capped) {
      return `Capped at ${strategySettings.capMonths} months`;
    }
    if (!consolidationResult.months) return "No payoff yet";
    return `${consolidationResult.months} months`;
  };

  const handleAddDebt = () => {
    const trimmedName = newDebt.name.trim();
    if (!trimmedName) return;
    setDebts((prev) => [
      ...prev,
      {
        ...newDebt,
        id: createId(),
        name: trimmedName,
      },
    ]);
    setNewDebt(emptyDebt);
  };

  const handleSample = () => {
    setDebts(sampleDebts);
    setSettings(sampleSettings);
    setConsolidation(sampleConsolidation);
    setNewDebt(emptyDebt);
    setCalcTrigger((prev) => prev + 1);
  };

  const handleCalculate = () => {
    setCalcTrigger((prev) => prev + 1);
  };

  const handleSave = () => {
    const payload = JSON.stringify({
      debts,
      settings,
      consolidation,
    });
    localStorage.setItem(storageKey, payload);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        debts?: DebtRow[];
        settings?: SettingsForm;
        consolidation?: ConsolidationForm;
      };
      if (parsed.debts) setDebts(parsed.debts);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.consolidation) setConsolidation(parsed.consolidation);
      setCalcTrigger((prev) => prev + 1);
    } catch {
      return;
    }
  };

  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setDebts([]);
    setSettings(defaultSettings);
    setConsolidation(defaultConsolidation);
    setNewDebt(emptyDebt);
    setCalcTrigger((prev) => prev + 1);
  };

  const exportSnowball = () => {
    downloadCsv("snowball-amortization.csv", amortizationRows(snowball));
  };

  const exportAvalanche = () => {
    downloadCsv("avalanche-amortization.csv", amortizationRows(avalanche));
  };

  const exportConsolidation = () => {
    if (!consolidationResult.eligible) return;
    downloadCsv(
      "consolidation-amortization.csv",
      amortizationRows(consolidationResult)
    );
  };

  const exportAll = () => {
    exportSnowball();
    setTimeout(() => exportAvalanche(), 200);
    if (consolidationResult.eligible) {
      setTimeout(() => exportConsolidation(), 400);
    }
  };

  const roundedExtra = applyRounding(
    toPositiveNumber(settings.extraMonthly),
    settings.rounding
  );

  return (
    <div className="py-8">
      <Container className="max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
        <FadeIn className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold text-brand-primary">
              Debt Strategies Calculator
            </h1>
            <Badge variant="soft">Philippines</Badge>
          </div>
          <p className="text-sm text-brand-muted">
            Assumptions: APR is nominal annual, compounded monthly. Minimum payments
            are raised to at least interest. Rounding only affects extra payments.
          </p>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
              <p className="font-semibold text-brand-primary">How to use this calculator</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5">
                <li>Add each debt with balance, APR, and minimum payment.</li>
                <li>Set your extra monthly payment and consolidation assumptions.</li>
                <li>Compare snowball, avalanche, and consolidation results.</li>
                <li>Use the outputs to guide discussion, not to replace advice.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4 text-sm text-brand-muted">
              <p className="font-semibold text-brand-primary">Educational note</p>
              <p className="mt-2">
                This calculator is for educational purposes only. It helps you compare
                payoff strategies, but it does not replace lender terms, legal advice,
                or personalized financial guidance.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid items-start gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5 lg:min-w-[360px] xl:min-w-[400px] lg:pr-2">
            <FadeIn>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader className="space-y-1 p-5">
                  <CardTitle className="text-base">Your Debts</CardTitle>
                  <p className="text-xs text-brand-muted">Add debts below, then compare payoff strategies.</p>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-0">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">Name</label>
                      <Input
                        className="h-10 text-sm"
                        placeholder="Debt name"
                        value={newDebt.name}
                        onChange={(event) =>
                          setNewDebt((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">Balance</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={newDebt.balance}
                        onChange={(event) =>
                          setNewDebt((prev) => ({
                            ...prev,
                            balance: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">APR</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={newDebt.apr}
                        onChange={(event) =>
                          setNewDebt((prev) => ({
                            ...prev,
                            apr: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">Min Payment</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={newDebt.minPayment}
                        onChange={(event) =>
                          setNewDebt((prev) => ({
                            ...prev,
                            minPayment: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" className="px-3" onClick={handleAddDebt}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" className="px-3" onClick={handleSample}>
                      Sample
                    </Button>
                    <Button size="sm" variant="outline" className="px-3" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="px-3" onClick={handleLoad}>
                      Load
                    </Button>
                    <Button size="sm" variant="ghost" className="px-3" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {debts.length === 0 ? (
                      <p className="text-xs text-brand-muted">Add your debts to calculate the payoff strategies.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-brand-primary/10">
                        <div className="max-h-[280px] overflow-y-auto md:max-h-[320px]">
                          <table className="min-w-[680px] w-full text-left text-xs">
                            <thead className="sticky top-0 bg-white/90 text-[10px] uppercase text-brand-secondary">
                              <tr>
                                <th className="px-2 py-2">Debt</th>
                                <th className="px-2 py-2">Balance</th>
                                <th className="px-2 py-2">APR</th>
                                <th className="px-2 py-2">Min Payment</th>
                                <th className="px-2 py-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {debts.map((debt) => (
                                <tr key={debt.id} className="border-t">
                                  <td className="px-2 py-1.5">
                                    <Input
                                      className="h-8 text-xs"
                                      placeholder="Debt name"
                                      value={debt.name}
                                      onChange={(event) =>
                                        setDebts((prev) =>
                                          prev.map((row) =>
                                            row.id === debt.id
                                              ? { ...row, name: event.target.value }
                                              : row
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <Input
                                      className="h-8 text-xs"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      inputMode="decimal"
                                      value={debt.balance}
                                      onChange={(event) =>
                                        setDebts((prev) =>
                                          prev.map((row) =>
                                            row.id === debt.id
                                              ? { ...row, balance: event.target.value }
                                              : row
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <Input
                                      className="h-8 text-xs"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      inputMode="decimal"
                                      value={debt.apr}
                                      onChange={(event) =>
                                        setDebts((prev) =>
                                          prev.map((row) =>
                                            row.id === debt.id
                                              ? { ...row, apr: event.target.value }
                                              : row
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <Input
                                      className="h-8 text-xs"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      inputMode="decimal"
                                      value={debt.minPayment}
                                      onChange={(event) =>
                                        setDebts((prev) =>
                                          prev.map((row) =>
                                            row.id === debt.id
                                              ? {
                                                  ...row,
                                                  minPayment: event.target.value,
                                                }
                                              : row
                                          )
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-[10px]"
                                      onClick={() =>
                                        setDebts((prev) =>
                                          prev.filter((row) => row.id !== debt.id)
                                        )
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              <tr className="border-t bg-brand-background/60 text-[10px] font-semibold text-brand-primary">
                                <td className="px-2 py-2">Total</td>
                                <td className="px-2 py-2">{formatPHP(totalBalance)}</td>
                                <td className="px-2 py-2">-</td>
                                <td className="px-2 py-2">{formatPHP(totalMinPayment)}</td>
                                <td className="px-2 py-2" />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader className="space-y-1 p-5">
                  <CardTitle className="text-base">Strategy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">
                        Extra Monthly Budget (PHP)
                      </label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={settings.extraMonthly}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            extraMonthly: event.target.value,
                          }))
                        }
                      />
                      <p className="text-[10px] text-brand-muted">Rounded extra: {formatPHP(roundedExtra)}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Cap Months Safety</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="1"
                        step="1"
                        value={settings.capMonths}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            capMonths: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-primary">Rounding (extra/target only)</label>
                    <Select
                      value={settings.rounding}
                      onValueChange={(value: RoundingOption) =>
                        setSettings((prev) => ({ ...prev, rounding: value }))
                      }
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select rounding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No rounding</SelectItem>
                        <SelectItem value="50">Nearest 50</SelectItem>
                        <SelectItem value="100">Nearest 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader className="space-y-1 p-5">
                  <CardTitle className="text-base">Consolidation (Secured Loan)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-0">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">APR %</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={consolidation.apr}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            apr: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Term (months)</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="1"
                        step="1"
                        value={consolidation.termMonths}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            termMonths: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Origination Fee %</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={consolidation.originationFeePct}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            originationFeePct: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Fixed Fees (PHP)</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={consolidation.fixedFees}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            fixedFees: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Finance Fees Into Loan?</label>
                      <Select
                        value={consolidation.financeFees}
                        onValueChange={(value: "finance" | "upfront") =>
                          setConsolidation((prev) => ({
                            ...prev,
                            financeFees: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Yes</SelectItem>
                          <SelectItem value="upfront">No (upfront)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Collateral Type</label>
                      <Select
                        value={consolidation.collateralType}
                        onValueChange={(value) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            collateralType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vehicle (OR/CR)">Vehicle (OR/CR)</SelectItem>
                          <SelectItem value="Condo/House & Lot (Title)">
                            Condo/House &amp; Lot (Title)
                          </SelectItem>
                          <SelectItem value="Land (Title)">Land (Title)</SelectItem>
                          <SelectItem value="Other Secured Asset">Other Secured Asset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Appraised Value (PHP)</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={consolidation.appraisedValue}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            appraisedValue: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-primary">Max LTV %</label>
                      <Input
                        className="h-10 text-sm"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={consolidation.maxLtvPct}
                        onChange={(event) =>
                          setConsolidation((prev) => ({
                            ...prev,
                            maxLtvPct: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-brand-primary/10 bg-brand-background p-3 text-xs text-brand-muted">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p>LTV limit: {formatPHP(ltvLimit)}</p>
                        <p>Financed principal: {formatPHP(financedPrincipal)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">Eligibility</p>
                        <p className="text-xs font-semibold text-brand-primary">
                          {consolidationResult.eligible ? "Eligible" : "Not eligible"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-brand-muted">
                      {eligibilityReason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" className="px-3" onClick={handleCalculate}>
                      Calculate &amp; Compare
                    </Button>
                    <Button size="sm" variant="outline" className="px-3" onClick={exportAll}>
                      Export All Tables to CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
          <div className="space-y-4 lg:col-span-7 min-w-0">
            <FadeIn>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader className="px-4 pt-4 pb-2">
                  <CardTitle className="text-base">Results Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <Stagger className="grid gap-3 md:grid-cols-3">
                    <StaggerItem>
                      <div className="rounded-lg border border-brand-primary/10 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary">
                          Snowball
                        </p>
                        <p className="text-lg font-semibold text-brand-primary">
                          {statusText(snowball)}
                        </p>
                        <p className="text-xs text-brand-muted">
                          Total interest: {formatPHP(snowball.totalInterest)}
                        </p>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="rounded-lg border border-brand-primary/10 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary">
                          Avalanche
                        </p>
                        <p className="text-lg font-semibold text-brand-primary">
                          {statusText(avalanche)}
                        </p>
                        <p className="text-xs text-brand-muted">
                          Total interest: {formatPHP(avalanche.totalInterest)}
                        </p>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="rounded-lg border border-brand-primary/10 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary">
                          Consolidation
                        </p>
                        <p className="text-lg font-semibold text-brand-primary">
                          {consStatusText()}
                        </p>
                        <p className="text-xs text-brand-muted">
                          Interest + fees:{" "}
                          {formatPHP(consolidationResult.totalCost)}
                        </p>
                      </div>
                    </StaggerItem>
                  </Stagger>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-brand-primary">Charts</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-brand-primary/10 bg-white/80">
                  <CardHeader className="px-4 pt-4 pb-1">
                    <CardTitle className="text-sm">Payoff Time (Months)</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    {hasDebts ? (
                      <div className="h-[260px] w-full md:h-[320px]">
                        <SimpleBarChart
                          title=""
                          className="h-full w-full"
                          data={[
                            {
                              label: "Snowball",
                              value: snowball.months,
                              color: "var(--color-brand-primary)",
                            },
                            {
                              label: "Avalanche",
                              value: avalanche.months,
                              color: "var(--color-brand-gold)",
                            },
                            {
                              label: "Consolidation",
                              value: consolidationResult.eligible
                                ? consolidationResult.months
                                : 0,
                              color: "var(--color-brand-secondary)",
                              disabled: !consolidationResult.eligible,
                            },
                          ]}
                          valueFormatter={(value) => `${value}`}
                        />
                      </div>
                    ) : (
                      <div className="flex h-[260px] w-full items-center justify-center rounded-lg border border-dashed border-brand-primary/10 text-xs text-brand-muted md:h-[320px]">
                        Add debts then click Calculate &amp; Compare or Sample.
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-brand-primary/10 bg-white/80">
                  <CardHeader className="px-4 pt-4 pb-1">
                    <CardTitle className="text-sm">
                      Total Interest / Cost (PHP)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    {hasDebts ? (
                      <div className="h-[260px] w-full md:h-[320px]">
                        <SimpleBarChart
                          title=""
                          className="h-full w-full"
                          data={[
                            {
                              label: "Snowball",
                              value: snowball.totalInterest,
                              color: "var(--color-brand-primary)",
                            },
                            {
                              label: "Avalanche",
                              value: avalanche.totalInterest,
                              color: "var(--color-brand-gold)",
                            },
                            {
                              label: "Consolidation",
                              value: consolidationResult.eligible
                                ? consolidationResult.totalCost
                                : 0,
                              color: "var(--color-brand-secondary)",
                              disabled: !consolidationResult.eligible,
                            },
                          ]}
                          valueFormatter={(value) => formatNumber(value)}
                        />
                      </div>
                    ) : (
                      <div className="flex h-[260px] w-full items-center justify-center rounded-lg border border-dashed border-brand-primary/10 text-xs text-brand-muted md:h-[320px]">
                        Add debts then click Calculate &amp; Compare or Sample.
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-brand-primary/10 bg-white/80 md:col-span-2">
                  <CardHeader className="px-4 pt-4 pb-1">
                    <CardTitle className="text-sm">Total Balance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    {hasDebts ? (
                      <div className="h-[320px] w-full md:h-[420px]">
                        <SimpleLineChart
                          title=""
                          className="h-full w-full"
                          series={[
                            {
                              id: "snowball",
                              label: "Snowball",
                              values: snowball.balanceSeries,
                              color: "var(--color-brand-primary)",
                            },
                            {
                              id: "avalanche",
                              label: "Avalanche",
                              values: avalanche.balanceSeries,
                              color: "var(--color-brand-gold)",
                              dash: "6 4",
                            },
                            {
                              id: "consolidation",
                              label: "Consolidation",
                              values: consolidationResult.eligible
                                ? consolidationResult.balanceSeries
                                : [],
                              color: "var(--color-brand-secondary)",
                              dash: "2 3",
                              disabled: !consolidationResult.eligible,
                            },
                          ]}
                          valueFormatter={(value) => formatPHP(value)}
                          yLabelFormatter={(value) => formatNumber(value)}
                          xLabelFormatter={(value) => `${value} mo`}
                        />
                      </div>
                    ) : (
                      <div className="flex h-[320px] w-full items-center justify-center rounded-lg border border-dashed border-brand-primary/10 text-xs text-brand-muted md:h-[420px]">
                        Add debts then click Calculate &amp; Compare or Sample.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-brand-primary">Amortization Tables</h2>
          </div>

          <div className="space-y-6">
            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader className="flex items-center justify-between gap-3 pb-2">
                <CardTitle className="text-base">Snowball</CardTitle>
                <Button size="sm" variant="outline" onClick={exportSnowball}>
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-brand-muted">
                <p>{payoffOrderText(snowball)}</p>
                <div className="w-full overflow-x-auto">
                  <div className="max-h-[520px] overflow-y-auto rounded-lg border border-brand-primary/10">
                    <table className="min-w-[900px] text-left text-xs">
                      <thead className="sticky top-0 bg-white/90 text-[10px] uppercase text-brand-secondary">
                        <tr>
                          <th className="px-3 py-2">Month</th>
                          <th className="px-3 py-2">Payment</th>
                          <th className="px-3 py-2">Interest</th>
                          <th className="px-3 py-2">Principal</th>
                          <th className="px-3 py-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {snowball.amortization.map((row) => (
                          <tr key={`snowball-${row.month}`} className="border-t">
                            <td className="px-3 py-1.5">{row.month}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.payment)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.interest)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.principal)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader className="flex items-center justify-between gap-3 pb-2">
                <CardTitle className="text-base">Avalanche</CardTitle>
                <Button size="sm" variant="outline" onClick={exportAvalanche}>
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-brand-muted">
                <p>{payoffOrderText(avalanche)}</p>
                <div className="w-full overflow-x-auto">
                  <div className="max-h-[520px] overflow-y-auto rounded-lg border border-brand-primary/10">
                    <table className="min-w-[900px] text-left text-xs">
                      <thead className="sticky top-0 bg-white/90 text-[10px] uppercase text-brand-secondary">
                        <tr>
                          <th className="px-3 py-2">Month</th>
                          <th className="px-3 py-2">Payment</th>
                          <th className="px-3 py-2">Interest</th>
                          <th className="px-3 py-2">Principal</th>
                          <th className="px-3 py-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {avalanche.amortization.map((row) => (
                          <tr key={`avalanche-${row.month}`} className="border-t">
                            <td className="px-3 py-1.5">{row.month}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.payment)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.interest)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.principal)}</td>
                            <td className="px-3 py-1.5">{formatPHP(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader className="flex items-center justify-between gap-3 pb-2">
                <CardTitle className="text-base">Consolidation</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportConsolidation}
                  disabled={!consolidationResult.eligible}
                >
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-brand-muted">
                {!consolidationResult.eligible ? (
                  <p>
                    Not eligible for consolidation. Check collateral LTV/appraisal.
                  </p>
                ) : (
                  <>
                    <p>
                      Term: {consolidationSettings.termMonths} months | Fees:{" "}
                      {formatPHP(consolidationResult.totalFees)}
                    </p>
                    <div className="w-full overflow-x-auto">
                      <div className="max-h-[520px] overflow-y-auto rounded-lg border border-brand-primary/10">
                        <table className="min-w-[900px] text-left text-xs">
                          <thead className="sticky top-0 bg-white/90 text-[10px] uppercase text-brand-secondary">
                            <tr>
                              <th className="px-3 py-2">Month</th>
                              <th className="px-3 py-2">Payment</th>
                              <th className="px-3 py-2">Interest</th>
                              <th className="px-3 py-2">Principal</th>
                              <th className="px-3 py-2">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {consolidationResult.amortization.map((row) => (
                              <tr key={`cons-${row.month}`} className="border-t">
                                <td className="px-3 py-1.5">{row.month}</td>
                                <td className="px-3 py-1.5">{formatPHP(row.payment)}</td>
                                <td className="px-3 py-1.5">{formatPHP(row.interest)}</td>
                                <td className="px-3 py-1.5">{formatPHP(row.principal)}</td>
                                <td className="px-3 py-1.5">{formatPHP(row.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Assumptions &amp; Caution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                <li>All amounts are in PHP using en-PH formatting.</li>
                <li>APR is nominal annual, compounded monthly.</li>
                <li>
                  Minimum payments are raised to at least interest to avoid negative
                  amortization.
                </li>
                <li>
                  Rounding applies only to extra/target payments; last month adjusts to
                  close balances.
                </li>
                <li>
                  Consolidation requires collateral and LTV meeting your settings; if
                  not satisfied, consolidation is disabled.
                </li>
                <li>
                  Educational tool only. Consult a BSP-regulated lender for exact
                  terms.
                </li>
              </ul>
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-secondary">
                Made for the Philippine market 2025
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-brand-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle>Want help interpreting the results?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/82">
              <p>
                Use the calculator to understand scenarios, then book a session if you
                want help deciding what the numbers mean for your real situation.
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

