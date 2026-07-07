import { initialExpenses, ExpenseItem, PlannerState } from './types';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function shouldOccur(expense: { frequency: number; startYear: number }, year: number) {
  if (expense.frequency === 0) {
    return year === expense.startYear;
  }

  return year >= expense.startYear && (year - expense.startYear) % expense.frequency === 0;
}

export const defaultState = {
  startingBalance: 8185.17,
  assessmentAmount: 187.5,
  projectionYears: 25,
};

export function loadState(): PlannerState {
  if (typeof window === 'undefined') {
    return {
      ...defaultState,
      expenses: initialExpenses,
    };
  }

  try {
    const saved = window.localStorage.getItem('hoa-budget-planner-state');
    if (!saved) {
      return {
        ...defaultState,
        expenses: initialExpenses,
      };
    }

    const parsed = JSON.parse(saved) as PlannerState;
    return {
      startingBalance: defaultState.startingBalance,
      assessmentAmount: Number(parsed.assessmentAmount) || defaultState.assessmentAmount,
      projectionYears: Number(parsed.projectionYears) || defaultState.projectionYears,
      expenses: Array.isArray(parsed.expenses) && parsed.expenses.length ? parsed.expenses : initialExpenses,
    };
  } catch {
    return {
      ...defaultState,
      expenses: initialExpenses,
    };
  }
}

export function saveState(state: PlannerState) {
  window.localStorage.setItem('hoa-budget-planner-state', JSON.stringify(state));
}