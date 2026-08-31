export type EntryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: EntryType;
  /** Groups categories in the UI, e.g. "Sparen" for Consors/Taures/... */
  group?: string;
  /** Default categories can't be deleted, only hidden by the user. */
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: EntryType;
  categoryId: string;
  description: string;
  amount: number; // always positive; sign follows `type`
}
