import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { CategoryManager } from './components/CategoryManager';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { useAuth } from './hooks/useAuth';
import { useBudget } from './hooks/useBudget';
import type { Transaction } from './types';

type Tab = 'erfassen' | 'uebersicht' | 'kategorien';

function App() {
  const { session, loading: authLoading, signOut } = useAuth();

  if (authLoading) {
    return <p className="empty-state">Lade…</p>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <BudgetApp userId={session.user.id} userEmail={session.user.email ?? ''} onSignOut={signOut} />;
}

interface BudgetAppProps {
  userId: string;
  userEmail: string;
  onSignOut: () => void;
}

function BudgetApp({ userId, userEmail, onSignOut }: BudgetAppProps) {
  const {
    transactions,
    categories,
    categoryById,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  } = useBudget(userId);

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
        <div className="app-header-top">
          <span className="user-email">{userEmail}</span>
          <button type="button" className="signout-button" onClick={onSignOut}>
            Abmelden
          </button>
        </div>
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
        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p className="empty-state">Lade deine Daten…</p>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
