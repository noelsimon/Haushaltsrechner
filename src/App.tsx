import { useState } from 'react';
import { CategoryManager } from './components/CategoryManager';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { useBudget } from './hooks/useBudget';
import type { Transaction } from './types';

type Tab = 'erfassen' | 'uebersicht' | 'kategorien';

function App() {
  const {
    transactions,
    categories,
    categoryById,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  } = useBudget();

  const [tab, setTab] = useState<Tab>('erfassen');
  const [editing, setEditing] = useState<Transaction | null>(null);

  const handleSubmit = (input: Omit<Transaction, 'id'>) => {
    if (editing) {
      updateTransaction(editing.id, input);
      setEditing(null);
    } else {
      addTransaction(input);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Haushaltsrechner</h1>
        <p>Einnahmen &amp; Ausgaben erfassen, nach Kategorie im Blick behalten.</p>
      </header>

      <nav className="tab-nav">
        <button className={tab === 'erfassen' ? 'active' : ''} onClick={() => setTab('erfassen')}>
          Erfassen
        </button>
        <button className={tab === 'uebersicht' ? 'active' : ''} onClick={() => setTab('uebersicht')}>
          Übersicht
        </button>
        <button className={tab === 'kategorien' ? 'active' : ''} onClick={() => setTab('kategorien')}>
          Kategorien
        </button>
      </nav>

      <main className="app-main">
        {tab === 'erfassen' && (
          <>
            <TransactionForm
              categories={categories}
              onSubmit={handleSubmit}
              editing={editing}
              onCancelEdit={() => setEditing(null)}
            />
            <TransactionList
              transactions={transactions}
              categoryById={categoryById}
              onEdit={(t) => {
                setEditing(t);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={deleteTransaction}
            />
          </>
        )}

        {tab === 'uebersicht' && (
          <Dashboard transactions={transactions} categoryById={categoryById} />
        )}

        {tab === 'kategorien' && (
          <CategoryManager categories={categories} onAdd={addCategory} onDelete={deleteCategory} />
        )}
      </main>
    </div>
  );
}

export default App;
