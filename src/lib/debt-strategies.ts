export type RoundingOption = "none" | "50" | "100";

export interface DebtInput {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

export interface Settings {
  extraMonthly: number;
  capMonths: number;
  rounding: RoundingOption;
}

export interface ConsolidationSettings {
  enabled: boolean;
  apr: number;
  termMonths: number;
  originationFeePct: number;
  fixedFees: number;
  financeFees: "finance" | "upfront";
  collateralType: string;
  appraisedValue: number;
  maxLtvPct: number;
}

export interface PayoffMeta {
  name: string;
  month: number;
}

export interface AmortRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface StrategyResult {
  months: number;
  totalInterest: number;
  totalFees: number;
  totalCost: number;
  amortization: AmortRow[];
  balanceSeries: number[];
  payoffOrder: PayoffMeta[];
  capped: boolean;
  eligible?: boolean;
  note?: string;
}

const EPSILON = 0.01;

function monthlyRate(apr: number) {
  if (!Number.isFinite(apr) || apr <= 0) return 0;
  return apr / 100 / 12;
}

function clampBalance(value: number) {
  return value < EPSILON ? 0 : value;
}

export function normalizeMinPayment(debt: DebtInput, rate: number) {
  const interest = debt.balance * rate;
  return Math.max(debt.minPayment, interest);
}

export function applyRounding(amount: number, rounding: RoundingOption) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (rounding === "none") return amount;
  const increment = rounding === "50" ? 50 : 100;
  return Math.round(amount / increment) * increment;
}

function sumBalances(debts: DebtInput[]) {
  return debts.reduce((total, debt) => total + debt.balance, 0);
}

type OrderKey = "snowball" | "avalanche";

function getOrdering(order: OrderKey) {
  if (order === "avalanche") {
    return (a: DebtInput, b: DebtInput) => {
      if (b.apr !== a.apr) return b.apr - a.apr;
      if (a.balance !== b.balance) return a.balance - b.balance;
      return a.name.localeCompare(b.name);
    };
  }
  return (a: DebtInput, b: DebtInput) => {
    if (a.balance !== b.balance) return a.balance - b.balance;
    if (b.apr !== a.apr) return b.apr - a.apr;
    return a.name.localeCompare(b.name);
  };
}

function simulateOrdered(debts: DebtInput[], settings: Settings, order: OrderKey) {
  const working = debts
    .filter((debt) => Number.isFinite(debt.balance) && debt.balance > 0)
    .map((debt) => ({ ...debt }));

  const amortization: AmortRow[] = [];
  const payoffOrder: PayoffMeta[] = [];
  const balanceSeries: number[] = [sumBalances(working)];
  let totalInterest = 0;
  let rollover = 0;
  let months = 0;

  while (months < settings.capMonths && working.some((debt) => debt.balance > 0)) {
    months += 1;
    const active = working.filter((debt) => debt.balance > 0);
    if (active.length === 0) break;

    const monthData = active.map((debt) => {
      const rate = monthlyRate(debt.apr);
      const interest = debt.balance * rate;
      const minPayment = normalizeMinPayment(debt, rate);
      return { debt, interest, minPayment };
    });

    let targetExtra = applyRounding(settings.extraMonthly + rollover, settings.rounding);
    if (!Number.isFinite(targetExtra)) targetExtra = 0;
    if (targetExtra < 0) targetExtra = 0;

    const payments = new Map<string, number>();
    monthData.forEach((item) => {
      payments.set(item.debt.id, item.minPayment);
    });

    const ordered = [...monthData].sort((a, b) => getOrdering(order)(a.debt, b.debt));
    let remainingExtra = targetExtra;

    for (const item of ordered) {
      if (remainingExtra <= 0) break;
      const currentPayment = payments.get(item.debt.id) ?? 0;
      const maxNeeded = item.debt.balance + item.interest;
      const additionalNeeded = Math.max(0, maxNeeded - currentPayment);
      if (additionalNeeded <= 0) continue;
      const add = Math.min(additionalNeeded, remainingExtra);
      payments.set(item.debt.id, currentPayment + add);
      remainingExtra -= add;
    }

    let monthPayment = 0;
    let monthInterest = 0;
    let monthBalance = 0;

    for (const item of monthData) {
      const previousBalance = item.debt.balance;
      let payment = payments.get(item.debt.id) ?? item.minPayment;
      const maxNeeded = item.debt.balance + item.interest;
      if (payment > maxNeeded) payment = maxNeeded;
      if (payment < item.interest) payment = item.interest;

      let nextBalance = item.debt.balance + item.interest - payment;
      nextBalance = clampBalance(nextBalance);

      item.debt.balance = nextBalance;
      monthPayment += payment;
      monthInterest += item.interest;
      monthBalance += nextBalance;

      if (nextBalance === 0 && previousBalance > 0) {
        payoffOrder.push({ name: item.debt.name, month: months });
        rollover += item.minPayment;
      }
    }

    totalInterest += monthInterest;
    amortization.push({
      month: months,
      payment: monthPayment,
      interest: monthInterest,
      principal: monthPayment - monthInterest,
      balance: monthBalance,
    });
    balanceSeries.push(monthBalance);
  }

  const remaining = working.some((debt) => debt.balance > 0);
  return {
    months,
    totalInterest,
    totalFees: 0,
    totalCost: totalInterest,
    amortization,
    balanceSeries,
    payoffOrder,
    capped: remaining && months >= settings.capMonths,
  } satisfies StrategyResult;
}

export function simulateSnowball(debts: DebtInput[], settings: Settings) {
  return simulateOrdered(debts, settings, "snowball");
}

export function simulateAvalanche(debts: DebtInput[], settings: Settings) {
  return simulateOrdered(debts, settings, "avalanche");
}

export function simulateConsolidation(
  debts: DebtInput[],
  settings: Settings,
  consSettings: ConsolidationSettings
): StrategyResult {
  if (!consSettings.enabled) {
    return {
      months: 0,
      totalInterest: 0,
      totalFees: 0,
      totalCost: 0,
      amortization: [],
      balanceSeries: [],
      payoffOrder: [],
      capped: false,
      eligible: false,
      note: "Consolidation disabled",
    };
  }

  const basePrincipal = sumBalances(debts);
  if (!Number.isFinite(basePrincipal) || basePrincipal <= 0) {
    return {
      months: 0,
      totalInterest: 0,
      totalFees: 0,
      totalCost: 0,
      amortization: [],
      balanceSeries: [],
      payoffOrder: [],
      capped: false,
      eligible: false,
      note: "No balances to consolidate",
    };
  }

  const originationFee = basePrincipal * (consSettings.originationFeePct / 100);
  const totalFees = originationFee + consSettings.fixedFees;
  const financedPrincipal =
    consSettings.financeFees === "finance" ? basePrincipal + totalFees : basePrincipal;
  const ltvLimit = consSettings.appraisedValue * (consSettings.maxLtvPct / 100);
  const eligible = ltvLimit > 0 && financedPrincipal <= ltvLimit;

  if (!eligible) {
    return {
      months: 0,
      totalInterest: 0,
      totalFees,
      totalCost: totalFees,
      amortization: [],
      balanceSeries: [],
      payoffOrder: [],
      capped: false,
      eligible: false,
      note: "Collateral LTV not sufficient",
    };
  }

  const termMonths = Math.max(1, Math.round(consSettings.termMonths));
  const rate = monthlyRate(consSettings.apr);
  const maxMonths = Math.min(settings.capMonths, termMonths);

  let payment = 0;
  if (rate === 0) {
    payment = financedPrincipal / termMonths;
  } else {
    payment =
      (financedPrincipal * rate) / (1 - Math.pow(1 + rate, -termMonths));
  }

  let balance = financedPrincipal;
  let totalInterest = 0;
  const amortization: AmortRow[] = [];
  const balanceSeries: number[] = [balance];

  for (let month = 1; month <= maxMonths && balance > 0; month += 1) {
    const interest = balance * rate;
    let monthPayment = payment;
    const maxNeeded = balance + interest;
    if (monthPayment > maxNeeded) monthPayment = maxNeeded;
    if (monthPayment < interest) monthPayment = interest;

    const principal = monthPayment - interest;
    balance = clampBalance(balance + interest - monthPayment);
    totalInterest += interest;

    amortization.push({
      month,
      payment: monthPayment,
      interest,
      principal,
      balance,
    });
    balanceSeries.push(balance);
  }

  const capped = balance > 0 && maxMonths >= settings.capMonths;
  const months = amortization.length;

  return {
    months,
    totalInterest,
    totalFees,
    totalCost: totalInterest + totalFees,
    amortization,
    balanceSeries,
    payoffOrder: [],
    capped,
    eligible: true,
  };
}
