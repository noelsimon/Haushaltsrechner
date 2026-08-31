import { useMemo, useState } from 'react';
import type { Category, Transaction } from '../types';
import { currentMonthKey, formatCurrency, formatMonth, monthKey } from '../lib/format';

interface Props {
  transactions: Transaction[];
  categoryById: Map<string, Category>;
}

interface MonthTotals {
  month: string;
  income: number;
  expense: number;
}

export function Dashboard({ transactions, categoryById }: Props) {
  const monthTotals = useMemo(() => {
    const map = new Map<string, MonthTotals>();
    for (const t of transactions) {
      const key = monthKey(t.date);
      const entry = map.get(key) ?? { month: key, income: 0, expense: 0 };
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    }
    return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const availableMonths = monthTotals.map((m) => m.month);
  const defaultMonth = availableMonths.includes(currentMonthKey())
    ? currentMonthKey()
    : (availableMonths[availableMonths.length - 1] ?? currentMonthKey());
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const activeMonth = availableMonths.includes(selectedMonth) ? selectedMonth : defaultMonth;

  const monthTransactions = transactions.filter((t) => monthKey(t.date) === activeMonth);
  const income = monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const expenseByCategory = new Map<string, number>();
  for (const t of monthTransactions) {
    if (t.type !== 'expense') continue;
    expenseByCategory.set(t.categoryId, (expenseByCategory.get(t.categoryId) ?? 0) + t.amount);
  }
  const maxCategoryAmount = Math.max(1, ...expenseByCategory.values());
  const categoryBreakdown = [...expenseByCategory.entries()]
    .map(([categoryId, amount]) => ({
      categoryId,
      name: categoryById.get(categoryId)?.name ?? 'Unbekannt',
      amount,
      pct: (amount / maxCategoryAmount) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const maxMonthTotal = Math.max(1, ...monthTotals.flatMap((m) => [m.income, m.expense]));

  if (transactions.length === 0) {
    return <p className="empty-state">Noch keine Daten – trage zuerst ein paar Einträge ein.</p>;
  }

  return (
    <div className="dashboard">
      <div className="month-select-row">
        <label>
          Monat
          <select value={activeMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonth(m)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <span className="label">Einnahmen</span>
          <span className="value">{formatCurrency(income)}</span>
        </div>
        <div className="summary-card expense">
          <span className="label">Ausgaben</span>
          <span className="value">{formatCurrency(expense)}</span>
        </div>
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="label">Überschuss</span>
          <span className="value">{formatCurrency(balance)}</span>
        </div>
      </div>

      <section className="panel">
        <h3>Ausgaben nach Kategorie</h3>
        {categoryBreakdown.length === 0 ? (
          <p className="empty-state">Keine Ausgaben in diesem Monat.</p>
        ) : (
          <ul className="category-breakdown">
            {categoryBreakdown.map((c) => (
              <li key={c.categoryId}>
                <div className="category-breakdown-row">
                  <span>{c.name}</span>
                  <span>{formatCurrency(c.amount)}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h3>Einnahmen &amp; Ausgaben im Verlauf</h3>
        <div className="trend-chart">
          {monthTotals.map((m) => (
            <div key={m.month} className="trend-bar-group" title={formatMonth(m.month)}>
              <div className="trend-bars">
                <div
                  className="trend-bar income"
                  style={{ height: `${(m.income / maxMonthTotal) * 100}%` }}
                />
                <div
                  className="trend-bar expense"
                  style={{ height: `${(m.expense / maxMonthTotal) * 100}%` }}
                />
              </div>
              <span className="trend-label">{formatMonth(m.month).slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="trend-legend">
          <span className="legend-item income">Einnahmen</span>
          <span className="legend-item expense">Ausgaben</span>
        </div>
      </section>
    </div>
  );
}
