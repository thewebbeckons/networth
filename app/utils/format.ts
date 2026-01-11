/**
 * Shared formatting utilities for currency and dates
 */

/**
 * Format a number as USD currency with full precision
 * @example formatCurrency(1234.56) => "$1,234.56"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

/**
 * Format a number as compact USD currency
 * @example formatCompactCurrency(1234567) => "$1.2M"
 */
export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)
}

/**
 * Parse a date string (yyyy-mm-dd) as a local date to avoid timezone offset issues.
 * Using the Date constructor with a date string can result in timezone shifts.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year!, month! - 1, day || 1)
}
