import type { Category } from '../types';

/**
 * Mirrors the categories used in the original Google-Sheets Haushaltsrechner
 * (Eingabetabelle + Finanzfluss sheets), so existing habits carry over 1:1.
 */
export const defaultCategories: Category[] = [
  // Einnahmen
  { id: 'gehalt', name: 'Gehalt', type: 'income', isDefault: true },
  { id: 'sonstige-einnahmen', name: 'Sonstige Einnahmen', type: 'income', isDefault: true },

  // Ausgaben – feste Kosten
  { id: 'wohnen', name: 'Wohnen (Miete/Nebenkosten)', type: 'expense', group: 'Fixkosten', isDefault: true },
  { id: 'betamove', name: 'Strom & Nebenkosten', type: 'expense', group: 'Fixkosten', isDefault: true },

  // Ausgaben – variabel
  { id: 'lebensmittel', name: 'Lebensmitteleinkäufe', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'haushalt', name: 'Haushalt und Co.', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'reisen', name: 'Reisen', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'ausgehen', name: 'Ausgehen', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'sport', name: 'Sport (Hobby + Klettern)', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'sonstiges', name: 'Sonstiges (Variabel)', type: 'expense', group: 'Variable Kosten', isDefault: true },
  { id: 'rueckzahlungen', name: 'Rückzahlungen', type: 'expense', group: 'Variable Kosten', isDefault: true },

  // Sparen / Erspartes
  { id: 'consors', name: 'Consors', type: 'expense', group: 'Sparen', isDefault: true },
  { id: 'taures', name: 'Taures', type: 'expense', group: 'Sparen', isDefault: true },
  { id: 'altersvorsorge', name: 'Altersvorsorge', type: 'expense', group: 'Sparen', isDefault: true },
  { id: 'bondora', name: 'Bondora', type: 'expense', group: 'Sparen', isDefault: true },
];
