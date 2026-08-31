import { useMemo, useState } from 'react';
import type { Category, EntryType, Transaction } from '../types';
import { todayIso } from '../lib/format';

interface Props {
  categories: Category[];
  onSubmit: (input: Omit<Transaction, 'id'>) => void;
  editing?: Transaction | null;
  onCancelEdit?: () => void;
}

export function TransactionForm({ categories, onSubmit, editing, onCancelEdit }: Props) {
  const [type, setType] = useState<EntryType>(editing?.type ?? 'expense');
  const [date, setDate] = useState(editing?.date ?? todayIso());
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [error, setError] = useState<string | null>(null);

  const categoriesForType = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  const resolvedCategoryId = categoriesForType.some((c) => c.id === categoryId)
    ? categoryId
    : (categoriesForType[0]?.id ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount.replace(',', '.'));
    if (!resolvedCategoryId) {
      setError('Bitte eine Kategorie auswählen.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Bitte einen gültigen Betrag eingeben.');
      return;
    }
    setError(null);
    onSubmit({
      type,
      date,
      categoryId: resolvedCategoryId,
      description: description.trim(),
      amount: parsedAmount,
    });
    if (!editing) {
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="type-toggle" role="radiogroup" aria-label="Art">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : 'expense'}
          onClick={() => setType('expense')}
          aria-pressed={type === 'expense'}
        >
          Ausgabe
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : 'income'}
          onClick={() => setType('income')}
          aria-pressed={type === 'income'}
        >
          Einnahme
        </button>
      </div>

      <div className="field-row">
        <label>
          Datum
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Kategorie
          <select
            value={resolvedCategoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categoriesForType.length === 0 && <option value="">Keine Kategorien</option>}
            {categoriesForType.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-row">
        <label>
          Beschreibung
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="z.B. Supermarkt"
          />
        </label>
        <label>
          Betrag (€)
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            required
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary">
          {editing ? 'Speichern' : 'Hinzufügen'}
        </button>
        {editing && onCancelEdit && (
          <button type="button" onClick={onCancelEdit}>
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}
