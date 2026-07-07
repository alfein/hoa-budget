import { formatCurrency } from '../utils';

interface HeaderProps {
  finalBalance: number;
  hasNegativeBalance: boolean;
  onSave: () => void;
}

export function Header({ finalBalance, hasNegativeBalance, onSave }: HeaderProps) {
  return (
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
        <button type="button" className="save-button" onClick={onSave}>
          Save
        </button>
      </div>
    </header>
  );
}