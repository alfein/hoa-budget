import { useState } from 'react';

interface IncomePanelProps {
  assessmentAmount: number;
  setAssessmentAmount: (value: number) => void;
  startingBalance: number;
  setStartingBalance: (value: number) => void;
  projectionYears: number;
  setProjectionYears: (value: number) => void;
  totalIncome: number;
  totalExpenses: number;
  isMobile: boolean;
  isIncomeCollapsed: boolean;
  setIsIncomeCollapsed: (value: boolean) => void;
}

export function IncomePanel({
  assessmentAmount,
  setAssessmentAmount,
  startingBalance,
  setStartingBalance,
  projectionYears,
  setProjectionYears,
  totalIncome,
  totalExpenses,
  isMobile,
  isIncomeCollapsed,
  setIsIncomeCollapsed,
}: IncomePanelProps) {
  return (
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
              <p>{assessmentAmount * 4 * 5 > 0 ? `$${(assessmentAmount * 4 * 5).toLocaleString()}` : '$0'}</p>
            </article>
            <article className="summary-card">
              <h3>Total income</h3>
              <p>{totalIncome > 0 ? `$${totalIncome.toLocaleString()}` : '$0'}</p>
            </article>
            <article className="summary-card">
              <h3>Total expenses</h3>
              <p>{totalExpenses > 0 ? `$${totalExpenses.toLocaleString()}` : '$0'}</p>
            </article>
          </div>
        </>
      )}
    </section>
  );
}