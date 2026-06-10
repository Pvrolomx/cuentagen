export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatMoney(amount: number, currency: 'USD' | 'MXN'): string {
  const symbol = currency === 'USD' ? '$' : 'MX$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
