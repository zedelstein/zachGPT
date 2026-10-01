/**
 * Compact a human date range for a chart axis or a narrow column header.
 *
 *   "June 2025 – Present"          -> "2025–now"
 *   "December 2021 – January 2024" -> "2021–24"
 *   "2015 – 2017"                  -> "2015–17"
 */
export function compactDates(dates: string): string {
  const years = dates.match(/\d{4}/g);
  if (!years || years.length === 0) return dates;
  const [start, end] = years;
  if (/present/i.test(dates)) return `${start}–now`;
  if (!end) return start;
  return `${start}–${end.slice(2)}`;
}
