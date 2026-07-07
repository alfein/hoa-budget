import { ExpenseItem } from '../types';

interface ExpensePanelProps {
  expenses: ExpenseItem[];
  updateExpense: (id: string, field: 'cost' | 'frequency' | 'startYear', value: string) => void;
  isMobile: boolean;
  isExpensesCollapsed: boolean;
  setIsExpensesCollapsed: (value: boolean) => void;
}

export function ExpensePanel({
  expenses,
  updateExpense,
  isMobile,
  isExpensesCollapsed,
  setIsExpensesCollapsed,
}: ExpensePanelProps) {
  return (
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
            <ExpenseCard key={expense.id} expense={expense} updateExpense={updateExpense} />
          ))}
        </div>
      )}
    </section>
  );
}

interface ExpenseCardProps {
  expense: ExpenseItem;
  updateExpense: (id: string, field: 'cost' | 'frequency' | 'startYear', value: string) => void;
}

function ExpenseCard({ expense, updateExpense }: ExpenseCardProps) {
  return (
    <div className="expense-card">
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
  );
}