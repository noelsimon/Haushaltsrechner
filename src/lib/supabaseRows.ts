import type { Category, EntryType, Transaction } from '../types';

export interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  type: EntryType;
  group_name: string | null;
  is_default: boolean;
  created_at: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  category_id: string;
  date: string;
  type: EntryType;
  description: string;
  amount: number;
  created_at: string;
}

export function categoryFromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    group: row.group_name ?? undefined,
    isDefault: row.is_default,
  };
}

export function transactionFromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    categoryId: row.category_id,
    description: row.description,
    amount: Number(row.amount),
  };
}
