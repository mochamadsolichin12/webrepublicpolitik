// Global Currency Formatter for Republic Politic: Dollar Republic Politic ($RP)
export const CURRENCY = {
  NAME: 'Dollar Republic Politic',
  SYMBOL: '$RP',
  SHORT_SYMBOL: '$',
};

/**
 * Format number into Dollar Republic Politic currency string
 * e.g. 1000 -> "$RP 1.000" or "$RP 1,5 Miliar" / "$RP 1,2 Triliun"
 */
export function formatCurrency(val, options = {}) {
  const { compact = false, showFull = false } = options;
  if (!val || val === 0) return `${CURRENCY.SYMBOL} 0`;
  const num = Number(val);
  if (isNaN(num)) return `${CURRENCY.SYMBOL} 0`;

  if (!showFull) {
    if (num >= 1e15) return `${CURRENCY.SYMBOL} ${(num / 1e15).toFixed(2)} Kuadriliun`;
    if (num >= 1e12) return `${CURRENCY.SYMBOL} ${(num / 1e12).toFixed(2)} Triliun`;
    if (num >= 1e9) return `${CURRENCY.SYMBOL} ${(num / 1e9).toFixed(2)} Miliar`;
    if (num >= 1e6 && (compact || num % 1e6 === 0)) return `${CURRENCY.SYMBOL} ${(num / 1e6).toFixed(1)} Juta`;
  }

  return `${CURRENCY.SYMBOL} ${Math.floor(num).toLocaleString('id-ID')}`;
}

// Alias helper
export const formatDollarRP = formatCurrency;
export const formatRP = formatCurrency;
