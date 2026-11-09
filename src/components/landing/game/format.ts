/** The live card's date, e.g. "FRI, NOV 6". */
export function formatCardDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
}
