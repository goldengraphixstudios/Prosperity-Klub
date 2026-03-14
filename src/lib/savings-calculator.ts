export type SavingsMode = "initial" | "periodic" | "time";
export type SavingsFrequency = "monthly" | "quarterly" | "yearly";
export type DepositTiming = "beginning" | "end";

export type SavingsInputs = {
  mode: SavingsMode;
  targetAmount: number;
  startingBalance: number;
  regularContribution: number;
  annualRatePct: number;
  years: number;
  frequency: SavingsFrequency;
  timing: DepositTiming;
};

export type YearlySnapshot = {
  period: number;
  yearLabel: string;
  periodicDeposits: number;
  totalDeposits: number;
  totalInterest: number;
  balance: number;
};

export type SavingsResult = {
  requiredInitial: number;
  requiredContribution: number;
  timeYears: number;
  totalDeposits: number;
  periodicDeposits: number;
  interestEarned: number;
  balance: number;
  breakdown: YearlySnapshot[];
  targetReached: boolean;
  periods: number;
  periodsPerYear: number;
};

const EPSILON = 0.01;

export function getPeriodsPerYear(frequency: SavingsFrequency) {
  if (frequency === "quarterly") return 4;
  if (frequency === "yearly") return 1;
  return 12;
}

type SimulationArgs = {
  initialBalance: number;
  contributionPerPeriod: number;
  annualRatePct: number;
  totalPeriods: number;
  frequency: SavingsFrequency;
  timing: DepositTiming;
};

export function simulateSavingsPlan({
  initialBalance,
  contributionPerPeriod,
  annualRatePct,
  totalPeriods,
  frequency,
  timing,
}: SimulationArgs): SavingsResult {
  const periodsPerYear = getPeriodsPerYear(frequency);
  const ratePerPeriod = annualRatePct / 100 / periodsPerYear;
  let balance = Math.max(0, initialBalance);
  let periodicDeposits = 0;
  let totalInterest = 0;
  const breakdown: YearlySnapshot[] = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    if (timing === "beginning") {
      balance += contributionPerPeriod;
      periodicDeposits += contributionPerPeriod;
    }

    const interest = balance * ratePerPeriod;
    balance += interest;
    totalInterest += interest;

    if (timing === "end") {
      balance += contributionPerPeriod;
      periodicDeposits += contributionPerPeriod;
    }

    if (period % periodsPerYear === 0 || period === totalPeriods) {
      breakdown.push({
        period,
        yearLabel: formatYearLabel(period / periodsPerYear),
        periodicDeposits,
        totalDeposits: initialBalance + periodicDeposits,
        totalInterest,
        balance,
      });
    }
  }

  return {
    requiredInitial: initialBalance,
    requiredContribution: contributionPerPeriod,
    timeYears: totalPeriods / periodsPerYear,
    totalDeposits: initialBalance + periodicDeposits,
    periodicDeposits,
    interestEarned: totalInterest,
    balance,
    breakdown,
    targetReached: false,
    periods: totalPeriods,
    periodsPerYear,
  };
}

export function solveSavings(inputs: SavingsInputs): SavingsResult {
  const periodsPerYear = getPeriodsPerYear(inputs.frequency);
  const requestedPeriods = Math.max(1, Math.round(inputs.years * periodsPerYear));
  const targetAmount = Math.max(0, inputs.targetAmount);
  const annualRatePct = Math.max(0, inputs.annualRatePct);
  const startingBalance = Math.max(0, inputs.startingBalance);
  const regularContribution = Math.max(0, inputs.regularContribution);

  if (inputs.mode === "time") {
    const result = solveTimeToTarget({
      targetAmount,
      annualRatePct,
      startingBalance,
      regularContribution,
      frequency: inputs.frequency,
      timing: inputs.timing,
    });
    return result;
  }

  if (inputs.mode === "initial") {
    const requiredInitial = solveInitialBalance({
      targetAmount,
      annualRatePct,
      regularContribution,
      totalPeriods: requestedPeriods,
      frequency: inputs.frequency,
      timing: inputs.timing,
    });
    const result = simulateSavingsPlan({
      initialBalance: requiredInitial,
      contributionPerPeriod: regularContribution,
      annualRatePct,
      totalPeriods: requestedPeriods,
      frequency: inputs.frequency,
      timing: inputs.timing,
    });
    return { ...result, targetReached: result.balance + EPSILON >= targetAmount };
  }

  const requiredContribution = solveRegularContribution({
    targetAmount,
    annualRatePct,
    startingBalance,
    totalPeriods: requestedPeriods,
    frequency: inputs.frequency,
    timing: inputs.timing,
  });
  const result = simulateSavingsPlan({
    initialBalance: startingBalance,
    contributionPerPeriod: requiredContribution,
    annualRatePct,
    totalPeriods: requestedPeriods,
    frequency: inputs.frequency,
    timing: inputs.timing,
  });
  return { ...result, targetReached: result.balance + EPSILON >= targetAmount };
}

function solveInitialBalance({
  targetAmount,
  annualRatePct,
  regularContribution,
  totalPeriods,
  frequency,
  timing,
}: Omit<SavingsInputs, "mode" | "startingBalance" | "years"> & {
  totalPeriods: number;
}) {
  let low = 0;
  let high = Math.max(targetAmount, 1);

  while (
    simulateSavingsPlan({
      initialBalance: high,
      contributionPerPeriod: regularContribution,
      annualRatePct,
      totalPeriods,
      frequency,
      timing,
    }).balance < targetAmount
  ) {
    high *= 2;
    if (high > targetAmount * 20 + 1_000_000) break;
  }

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const balance = simulateSavingsPlan({
      initialBalance: mid,
      contributionPerPeriod: regularContribution,
      annualRatePct,
      totalPeriods,
      frequency,
      timing,
    }).balance;

    if (balance >= targetAmount) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return roundCurrency(high);
}

function solveRegularContribution({
  targetAmount,
  annualRatePct,
  startingBalance,
  totalPeriods,
  frequency,
  timing,
}: Omit<SavingsInputs, "mode" | "regularContribution" | "years"> & {
  totalPeriods: number;
}) {
  const withoutContribution = simulateSavingsPlan({
    initialBalance: startingBalance,
    contributionPerPeriod: 0,
    annualRatePct,
    totalPeriods,
    frequency,
    timing,
  }).balance;

  if (withoutContribution >= targetAmount) {
    return 0;
  }

  let low = 0;
  let high = Math.max(targetAmount / totalPeriods, 1);

  while (
    simulateSavingsPlan({
      initialBalance: startingBalance,
      contributionPerPeriod: high,
      annualRatePct,
      totalPeriods,
      frequency,
      timing,
    }).balance < targetAmount
  ) {
    high *= 2;
    if (high > targetAmount * 5 + 1_000_000) break;
  }

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const balance = simulateSavingsPlan({
      initialBalance: startingBalance,
      contributionPerPeriod: mid,
      annualRatePct,
      totalPeriods,
      frequency,
      timing,
    }).balance;

    if (balance >= targetAmount) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return roundCurrency(high);
}

function solveTimeToTarget({
  targetAmount,
  annualRatePct,
  startingBalance,
  regularContribution,
  frequency,
  timing,
}: Omit<SavingsInputs, "mode" | "years">) {
  const periodsPerYear = getPeriodsPerYear(frequency);
  const ratePerPeriod = annualRatePct / 100 / periodsPerYear;
  let balance = Math.max(0, startingBalance);
  let periodicDeposits = 0;
  let totalInterest = 0;
  const breakdown: YearlySnapshot[] = [];
  const maxPeriods = periodsPerYear * 80;

  if (balance >= targetAmount) {
    return {
      requiredInitial: startingBalance,
      requiredContribution: regularContribution,
      timeYears: 0,
      totalDeposits: startingBalance,
      periodicDeposits: 0,
      interestEarned: 0,
      balance,
      breakdown: [],
      targetReached: true,
      periods: 0,
      periodsPerYear,
    };
  }

  for (let period = 1; period <= maxPeriods; period += 1) {
    if (timing === "beginning") {
      balance += regularContribution;
      periodicDeposits += regularContribution;
    }

    const interest = balance * ratePerPeriod;
    balance += interest;
    totalInterest += interest;

    if (timing === "end") {
      balance += regularContribution;
      periodicDeposits += regularContribution;
    }

    if (period % periodsPerYear === 0 || balance + EPSILON >= targetAmount) {
      breakdown.push({
        period,
        yearLabel: formatYearLabel(period / periodsPerYear),
        periodicDeposits,
        totalDeposits: startingBalance + periodicDeposits,
        totalInterest,
        balance,
      });
    }

    if (balance + EPSILON >= targetAmount) {
      return {
        requiredInitial: startingBalance,
        requiredContribution: regularContribution,
        timeYears: period / periodsPerYear,
        totalDeposits: startingBalance + periodicDeposits,
        periodicDeposits,
        interestEarned: totalInterest,
        balance,
        breakdown,
        targetReached: true,
        periods: period,
        periodsPerYear,
      };
    }
  }

  return {
    requiredInitial: startingBalance,
    requiredContribution: regularContribution,
    timeYears: maxPeriods / periodsPerYear,
    totalDeposits: startingBalance + periodicDeposits,
    periodicDeposits,
    interestEarned: totalInterest,
    balance,
    breakdown,
    targetReached: false,
    periods: maxPeriods,
    periodsPerYear,
  };
}

function formatYearLabel(years: number) {
  if (Math.abs(years - Math.round(years)) < 0.001) {
    return `${Math.round(years)}`;
  }
  return years.toFixed(1);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}
