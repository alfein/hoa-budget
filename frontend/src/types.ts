export type ExpenseItem = {
  id: string;
  label: string;
  cost: number;
  frequency: number;
  startYear: number;
};

export type PlannerState = {
  startingBalance: number;
  assessmentAmount: number;
  projectionYears: number;
  expenses: ExpenseItem[];
};

export const initialExpenses: ExpenseItem[] = [
  { id: 'insurance', label: 'Insurance', cost: 950, frequency: 1, startYear: 1 },
  { id: 'snow', label: 'Snow', cost: 5000, frequency: 1, startYear: 1 },
  { id: 'sewer', label: 'Sewer Maintenance', cost: 1675, frequency: 5, startYear: 2 },
  { id: 'blacktop-repave', label: 'Black Top Repave', cost: 25000, frequency: 0, startYear: 1 },
  { id: 'blacktop-maintenance', label: 'Black Top Maintenance', cost: 4800, frequency: 5, startYear: 3 },
];

export const houses = 5;
export const storageKey = 'hoa-budget-planner-state';