import { useMemo } from 'react';
import { defaultCategories } from '../data/defaultCategories';
import type { Category, EntryType, Transaction } from '../types';
import { useLocalStorage } from './useLocalStorage';

const TRANSACTIONS_KEY = 'haushaltsrechner:transactions';
const CATEGORIES_KEY = 'haushaltsrechner:categories';

function createId() {
  return crypto.randomUUID();
}

export function useBudget() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(TRANSACTIONS_KEY, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(CATEGORIES_KEY, defaultCategories);

  const addTransaction = (input: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [...prev, { ...input, id: createId() }]);
  };

  const updateTransaction = (id: string, input: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...input, id } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = (name: string, type: EntryType, group?: string) => {
    const id = `custom-${createId()}`;
    setCategories((prev) => [...prev, { id, name, type, group }]);
    return id;
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTransactions((prev) => prev.filter((t) => t.categoryId !== id));
  };

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    for (const c of categories) map.set(c.id, c);
    return map;
  }, [categories]);

  return {
    transactions,
    categories,
    categoryById,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
}
