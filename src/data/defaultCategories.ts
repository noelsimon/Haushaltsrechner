import type { EntryType } from '../types';

interface CategorySeed {
  name: string;
  type: EntryType;
  group_name: string | null;
}

/**
 * Mirrors the categories used in the original Google-Sheets Haushaltsrechner
 * (Eingabetabelle + Finanzfluss sheets). Inserted once per user on first
 * login (see useBudget) – ids are then assigned by the database.
 */
export const defaultCategorySeed: CategorySeed[] = [
  // Einnahmen
  { name: 'Gehalt', type: 'income', group_name: null },
  { name: 'Sonstige Einnahmen', type: 'income', group_name: null },

  // Ausgaben – feste Kosten
  { name: 'Wohnen (Miete/Nebenkosten)', type: 'expense', group_name: 'Fixkosten' },
  { name: 'Strom & Nebenkosten', type: 'expense', group_name: 'Fixkosten' },

  // Ausgaben – variabel
  { name: 'Lebensmitteleinkäufe', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Haushalt und Co.', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Reisen', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Ausgehen', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Sport (Hobby + Klettern)', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Sonstiges (Variabel)', type: 'expense', group_name: 'Variable Kosten' },
  { name: 'Rückzahlungen', type: 'expense', group_name: 'Variable Kosten' },

  // Sparen / Erspartes
  { name: 'Consors', type: 'expense', group_name: 'Sparen' },
  { name: 'Taures', type: 'expense', group_name: 'Sparen' },
  { name: 'Altersvorsorge', type: 'expense', group_name: 'Sparen' },
  { name: 'Bondora', type: 'expense', group_name: 'Sparen' },
];
