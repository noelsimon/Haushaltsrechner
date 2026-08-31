import { useState } from 'react';
import type { Category, EntryType } from '../types';

interface Props {
  categories: Category[];
  onAdd: (name: string, type: EntryType, group?: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryManager({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<EntryType>('expense');
  const [group, setGroup] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), type, group.trim() || undefined);
    setName('');
    setGroup('');
  };

  const income = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');
  const groupedExpense = new Map<string, Category[]>();
  for (const c of expense) {
    const key = c.group ?? 'Sonstige';
    const list = groupedExpense.get(key) ?? [];
    list.push(c);
    groupedExpense.set(key, list);
  }

  return (
    <div className="category-manager">
      <form className="category-form" onSubmit={handleSubmit}>
        <h3>Neue Kategorie</h3>
        <div className="field-row">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Auto" />
          </label>
          <label>
            Art
            <select value={type} onChange={(e) => setType(e.target.value as EntryType)}>
              <option value="expense">Ausgabe</option>
              <option value="income">Einnahme</option>
            </select>
          </label>
          <label>
            Gruppe (optional)
            <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="z.B. Fixkosten" />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary">Kategorie hinzufügen</button>
        </div>
      </form>

      <div className="category-columns">
        <section className="panel">
          <h3>Einnahmen</h3>
          <ul className="category-manage-list">
            {income.map((c) => (
              <li key={c.id}>
                <span>{c.name}</span>
                {!c.isDefault && (
                  <button type="button" onClick={() => onDelete(c.id)} aria-label="Löschen">
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3>Ausgaben</h3>
          {[...groupedExpense.entries()].map(([groupName, items]) => (
            <div key={groupName} className="category-group">
              <h4>{groupName}</h4>
              <ul className="category-manage-list">
                {items.map((c) => (
                  <li key={c.id}>
                    <span>{c.name}</span>
                    {!c.isDefault && (
                      <button type="button" onClick={() => onDelete(c.id)} aria-label="Löschen">
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
