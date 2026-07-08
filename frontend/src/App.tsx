import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { IncomePanel } from './components/IncomePanel';
import { ExpensePanel } from './components/ExpensePanel';
import { ProjectionTable } from './components/ProjectionTable';
import { ExpenseItem, houses } from './types';
import { loadState, saveState } from './utils';

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
  const [isIncomeCollapsed, setIsIncomeCollapsed] = useState(() => window.innerWidth < 640);
  const [isExpensesCollapsed, setIsExpensesCollapsed] = useState(() => window.innerWidth < 640);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useMemo(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveState = () => {
    saveState({
      startingBalance,
      assessmentAmount,
      projectionYears,
      expenses,
    });
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
      <Header
        finalBalance={finalBalance}
        hasNegativeBalance={hasNegativeBalance}
        onSave={handleSaveState}
      />

      <main className="content-grid">
        <ExpensePanel
          expenses={expenses}
          updateExpense={updateExpense}
          isMobile={isMobile}
          isExpensesCollapsed={isExpensesCollapsed}
          setIsExpensesCollapsed={setIsExpensesCollapsed}
        />

        <IncomePanel
          assessmentAmount={assessmentAmount}
          setAssessmentAmount={setAssessmentAmount}
          startingBalance={startingBalance}
          setStartingBalance={setStartingBalance}
          projectionYears={projectionYears}
          setProjectionYears={setProjectionYears}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          isMobile={isMobile}
          isIncomeCollapsed={isIncomeCollapsed}
          setIsIncomeCollapsed={setIsIncomeCollapsed}
        />


      </main>

      <ProjectionTable projection={projection} />
    </div>
  );
}