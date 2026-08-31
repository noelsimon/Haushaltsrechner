import type { Category, Transaction } from '../types';
import { formatCurrency, formatMonth, monthKey } from '../lib/format';

interface Props {
  transactions: Transaction[];
  categoryById: Map<string, Category>;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, categoryById, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p className="empty-state">Noch keine Einträge vorhanden.</p>;
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Transaction[]>();
  for (const t of sorted) {
    const key = monthKey(t.date);
    const list = groups.get(key) ?? [];
    list.push(t);
    groups.set(key, list);
  }

  return (
    <div className="transaction-list">
      {[...groups.entries()].map(([month, items]) => {
        const income = items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return (
          <section key={month} className="month-group">
            <header className="month-group-header">
              <h3>{formatMonth(month)}</h3>
              <span className="month-group-summary">
                <span className="income">+{formatCurrency(income)}</span>
                <span className="expense">-{formatCurrency(expense)}</span>
              </span>
            </header>
            <ul>
              {items.map((t) => {
                const category = categoryById.get(t.categoryId);
                return (
                  <li key={t.id} className={`transaction-row ${t.type}`}>
                    <div className="transaction-main">
                      <span className="transaction-date">{t.date}</span>
                      <span className="transaction-category">{category?.name ?? 'Unbekannt'}</span>
                      {t.description && (
                        <span className="transaction-desc">{t.description}</span>
                      )}
                    </div>
                    <div className="transaction-actions">
                      <span className="transaction-amount">
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </span>
                      <button type="button" onClick={() => onEdit(t)} aria-label="Bearbeiten">
                        ✎
                      </button>
                      <button type="button" onClick={() => onDelete(t.id)} aria-label="Löschen">
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
