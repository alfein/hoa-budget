import { formatCurrency } from '../utils';

interface ProjectionRow {
  year: number;
  beginningBalance: number;
  income: number;
  expenses: number;
  endingBalance: number;
}

interface ProjectionTableProps {
  projection: ProjectionRow[];
}

export function ProjectionTable({ projection }: ProjectionTableProps) {
  return (
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
                <td className={row.endingBalance >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(row.endingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}