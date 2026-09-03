import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultCategorySeed } from '../data/defaultCategories';
import { supabase } from '../lib/supabaseClient';
import { categoryFromRow, transactionFromRow, type CategoryRow, type TransactionRow } from '../lib/supabaseRows';
import type { Category, EntryType, Transaction } from '../types';

export function useBudget(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let { data: categoryRows, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (categoryError) {
      setError(categoryError.message);
      setLoading(false);
      return;
    }

    if (!categoryRows || categoryRows.length === 0) {
      const seed = defaultCategorySeed.map((c) => ({ ...c, user_id: userId, is_default: true }));
      const { data: inserted, error: insertError } = await supabase
        .from('categories')
        .insert(seed)
        .select();
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      categoryRows = inserted;
    }

    const { data: transactionRows, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (transactionError) {
      setError(transactionError.message);
      setLoading(false);
      return;
    }

    setCategories(((categoryRows ?? []) as CategoryRow[]).map(categoryFromRow));
    setTransactions(((transactionRows ?? []) as TransactionRow[]).map(transactionFromRow));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const addTransaction = async (input: Omit<Transaction, 'id'>) => {
    if (!userId) return;
    const { data, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        date: input.date,
        type: input.type,
        category_id: input.categoryId,
        description: input.description,
        amount: input.amount,
      })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTransactions((prev) => [transactionFromRow(data as TransactionRow), ...prev]);
  };

  const updateTransaction = async (id: string, input: Omit<Transaction, 'id'>) => {
    const { data, error: updateError } = await supabase
      .from('transactions')
      .update({
        date: input.date,
        type: input.type,
        category_id: input.categoryId,
        description: input.description,
        amount: input.amount,
      })
      .eq('id', id)
      .select()
      .single();
    if (updateError) {
      setError(updateError.message);
      return;
    }
    const updated = transactionFromRow(data as TransactionRow);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTransaction = async (id: string) => {
    const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = async (name: string, type: EntryType, group?: string) => {
    if (!userId) return;
    const { data, error: insertError } = await supabase
      .from('categories')
      .insert({ user_id: userId, name, type, group_name: group ?? null, is_default: false })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setCategories((prev) => [...prev, categoryFromRow(data as CategoryRow)]);
  };

  const deleteCategory = async (id: string) => {
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
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
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
}
