// Plan pricing shown in the UI. Single source so pricing cards, subscribe and checkout
// never drift (they previously showed $15 and $19 for the same plan).
// Limits (daily transcriptions, video length, formats) come from the API: GET /usage.
export const PRO_PRICE_USD = 15;

export const formatUsd = (amount: number) =>
  `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
