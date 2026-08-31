const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(dateIso: string): string {
  return dateIso.slice(0, 7); // YYYY-MM
}

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export function formatMonth(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return `${monthNames[month - 1]} ${year}`;
}

export function currentMonthKey(): string {
  return monthKey(todayIso());
}
