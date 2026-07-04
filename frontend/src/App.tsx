import { useMemo, useState } from 'react';

type ExpenseItem = {
  id: string;
  label: string;
  cost: number;
  frequency: number;
  startYear: number;
};

const initialExpenses: ExpenseItem[] = [
  { id: 'insurance', label: 'Insurance', cost: 950, frequency: 1, startYear: 1 },
  { id: 'snow', label: 'Snow', cost: 5000, frequency: 1, startYear: 1 },
  { id: 'sewer', label: 'Sewer Maintenance', cost: 1675, frequency: 5, startYear: 2 },
  { id: 'blacktop-repave', label: 'Black Top Repave', cost: 25000, frequency: 0, startYear: 1 },
  { id: 'blacktop-maintenance', label: 'Black Top Maintenance', cost: 4800, frequency: 5, startYear: 3 },
];

const houses = 5;
const storageKey = 'hoa-budget-planner-state';

type PlannerState = {
  startingBalance: number;
  assessmentAmount: number;
  projectionYears: number;
  expenses: ExpenseItem[];
};

function loadState(): PlannerState {
  if (typeof window === 'undefined') {
    return {
      startingBalance: 7000,
      assessmentAmount: 187.5,
      projectionYears: 25,
      expenses: initialExpenses,
    };
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return {
        startingBalance: 7000,
        assessmentAmount: 187.5,
        projectionYears: 25,
        expenses: initialExpenses,
      };
    }

    const parsed = JSON.parse(saved) as PlannerState;
    return {
      startingBalance: Number(parsed.startingBalance) || 7000,
      assessmentAmount: Number(parsed.assessmentAmount) || 187.5,
      projectionYears: Number(parsed.projectionYears) || 25,
      expenses: Array.isArray(parsed.expenses) && parsed.expenses.length ? parsed.expenses : initialExpenses,
    };
  } catch {
    return {
      startingBalance: 7000,
      assessmentAmount: 187.5,
      projectionYears: 25,
      expenses: initialExpenses,
    };
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function shouldOccur(expense: ExpenseItem, year: number) {
  if (expense.frequency === 0) {
    return year === expense.startYear;
  }

  return year >= expense.startYear && (year - expense.startYear) % expense.frequency === 0;
}

export default function App() {
  const [startingBalance, setStartingBalance] = useState(() => loadState().startingBalance);
  const [assessmentAmount, setAssessmentAmount] = useState(() => loadState().assessmentAmount);
  const [projectionYears, setProjectionYears] = useState(() => loadState().projectionYears);
  const [expenses, setExpenses] = useState(() => loadState().expenses);
  const [isIncomeCollapsed, setIsIncomeCollapsed] = useState(false);
  const [isExpensesCollapsed, setIsExpensesCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useMemo(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = () => {
    const state = {
      startingBalance,
      assessmentAmount,
      projectionYears,
      expenses,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const projection = useMemo(() => {
    const rows = [] as Array<{
      year: number;
      beginningBalance: number;
      income: number;
      expenses: number;
      endingBalance: number;
    }>;

    let balance = startingBalance;

    for (let year = 1; year <= projectionYears; year += 1) {
      const annualExpenses = expenses.reduce((sum, expense) => {
        if (expense.frequency === 0) {
          return sum;
        }

        if (!shouldOccur(expense, year)) {
          return sum;
        }

        return sum + expense.cost;
      }, 0);
      const annualIncome = year === 1 ? (assessmentAmount * 4 * houses) / 2 : assessmentAmount * 4 * houses;
      const beginningBalance = balance;
      const endingBalance = beginningBalance + annualIncome - annualExpenses;

      rows.push({
        year,
        beginningBalance,
        income: annualIncome,
        expenses: annualExpenses,
        endingBalance,
      });

      balance = endingBalance;
    }

    return rows;
  }, [startingBalance, assessmentAmount, projectionYears, expenses]);

  const finalBalance = projection[projection.length - 1]?.endingBalance ?? startingBalance;
  const totalIncome = projection.reduce((sum, row) => sum + row.income, 0);
  const totalExpenses = projection.reduce((sum, row) => sum + row.expenses, 0);
  const hasNegativeBalance = projection.some((row) => row.endingBalance < 0);

  const updateExpense = (id: string, field: 'cost' | 'frequency' | 'startYear', value: string) => {
    const parsedValue = Number(value) || 0;

    setExpenses((current) =>
      current.map((expense) => (expense.id === id ? { ...expense, [field]: parsedValue } : expense)),
    );
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">HOA Budget Planner</p>
          <h1>25-year association budget projection</h1>
          <p className="hero-copy">
            Enter the assessment income and each planned expense with its timing, then review the annual balance over the next 25 years.
          </p>
        </div>
        <div className="hero-cards-row">
          <article className={`summary-card ${hasNegativeBalance ? 'negative' : 'positive'}`}>
            <h3>Balance status</h3>
            <p>{hasNegativeBalance ? 'Negative years detected' : 'All years positive'}</p>
          </article>
        </div>
        <div className="hero-summary">
          <span>Projected balance in year 25</span>
          <strong>{formatCurrency(finalBalance)}</strong>
          <button type="button" className="save-button" onClick={saveState}>
            Save
          </button>
        </div>        
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-heading panel-heading-toggle">
            <div>
              <h2>Income and starting balance</h2>
              <p>Adjust the assessment amount and the opening reserve balance.</p>
            </div>
            {isMobile && (
              <button
                type="button"
                className="collapse-toggle"
                onClick={() => setIsIncomeCollapsed((current) => !current)}
                aria-expanded={!isIncomeCollapsed}
              >
                {isIncomeCollapsed ? 'Expand' : 'Collapse'}
              </button>
            )}
          </div>

          {(!isMobile || !isIncomeCollapsed) && (
            <>
              <div className="input-list">
                <label className="input-row">
                  <div>
                    <span className="input-label">Quarterly assessment</span>
                    <small>Applied to 5 homes, 4 times per year</small>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assessmentAmount}
                    onChange={(event) => setAssessmentAmount(Number(event.target.value) || 0)}
                  />
                </label>

                <label className="input-row">
                  <div>
                    <span className="input-label">Starting budget</span>
                    <small>Opening cash balance for year 1</small>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={startingBalance}
                    onChange={(event) => setStartingBalance(Number(event.target.value) || 0)}
                  />
                </label>

                <label className="input-row">
                  <div>
                    <span className="input-label">Projection years</span>
                    <small>How many years to forecast</small>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={projectionYears}
                    onChange={(event) => setProjectionYears(Number(event.target.value) || 1)}
                  />
                </label>
              </div>

              <div className="summary-grid">
                <article className="summary-card">
                  <h3>Annual income</h3>
                  <p>{formatCurrency(assessmentAmount * 4 * houses)}</p>
                </article>
                <article className="summary-card">
                  <h3>Total income</h3>
                  <p>{formatCurrency(totalIncome)}</p>
                </article>
                <article className="summary-card">
                  <h3>Total expenses</h3>
                  <p>{formatCurrency(totalExpenses)}</p>
                </article>
              </div>
            </>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading panel-heading-toggle">
            <div>
              <h2>Expense schedule</h2>
              <p>Each line can recur annually or at a custom interval. Use 0 for a one-time expense.</p>
            </div>
            {isMobile && (
              <button
                type="button"
                className="collapse-toggle"
                onClick={() => setIsExpensesCollapsed((current) => !current)}
                aria-expanded={!isExpensesCollapsed}
              >
                {isExpensesCollapsed ? 'Expand' : 'Collapse'}
              </button>
            )}
          </div>

          {(!isMobile || !isExpensesCollapsed) && (
            <div className="expense-list">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                  <span className="expense-label">{expense.label}</span>
                  <div className="expense-controls">
                    <label>
                      <span>Cost</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={expense.cost}
                        onChange={(event) => updateExpense(expense.id, 'cost', event.target.value)}
                      />
                    </label>
                    <label>
                      <span>Every</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={expense.frequency}
                        onChange={(event) => updateExpense(expense.id, 'frequency', event.target.value)}
                      />
                    </label>
                    <label>
                      <span>Start year</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={expense.startYear}
                        onChange={(event) => updateExpense(expense.id, 'startYear', event.target.value)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <section className="panel projection-panel">
        <div className="panel-heading">
          <h2>25-year budget grid</h2>
          <p>Each row shows the opening balance, annual income, annual expenses, and ending balance.</p>
        </div>

        <div className="table-wrap">
          <table className="projection-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Beginning balance</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Ending balance</th>
              </tr>
            </thead>
            <tbody>
              {projection.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.beginningBalance)}</td>
                  <td>{formatCurrency(row.income)}</td>
                  <td>{formatCurrency(row.expenses)}</td>
                  <td className={row.endingBalance >= 0 ? 'positive' : 'negative'}>{formatCurrency(row.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
