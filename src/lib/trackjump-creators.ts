import {createClient, type SupabaseClient} from '@supabase/supabase-js';

// The TrackJump app's own backend. Its publishable key is public by design;
// every creator number comes from functions that check who is signed in.
let client: SupabaseClient | null = null;
export function trackJumpClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_TRACKJUMP_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_TRACKJUMP_SUPABASE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: {storageKey: 'trackjump-creator-auth', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false},
  });
  return client;
}

export type Money = {currency: string; revenue: number; earned: number; pending: number; paid: number; payable: number};
export type MonthRow = {month: string; codeUses: number; customers: number; revenue: number; earned: number};
export type CreatorCode = {id?: string; code: string; active: boolean; discountProductID: string | null; uses: number};
export type Payout = {currency: string; amount: number; paidAt: string; method: string};
export type CreatorTotals = {codeUses: number; trials: number; customers: number; refunds: number; testPurchases?: number};
export type CreatorTerms = {
  id?: string; name: string; email?: string | null; revenueShare: number; shareMonths: number;
  proceedsRate?: number; holdDays: number; active?: boolean; note?: string; linked?: boolean;
};
export type CreatorSummary = {
  creator: CreatorTerms | null; codes: CreatorCode[]; totals: CreatorTotals;
  money: Money[]; months: MonthRow[]; payouts: Payout[];
  /** App Store offer codes the creator shares (for example KINGDAC). */
  offerCodes?: string[];
};
export type CodeUse = {
  redeemedAt: string; code: string; account: string | null; install: string | null;
  status: 'no_purchase' | 'trial' | 'trial_ended' | 'paying' | 'ended' | 'refunded';
  plan: string | null; currency: string | null; revenue: number; earned: number;
};

/** TrackJump's App Store ID, for offer-code redeem links. */
export const TRACKJUMP_APP_STORE_ID = '6809517672';

/** What a follower gets with a creator's App Store offer code. */
export const creatorOfferTerms = '$34.99 for the first year of TrackJump Pro';

/** Opens the App Store's redeem sheet with the code filled in. */
export function offerCodeLink(code: string): string {
  return `https://apps.apple.com/redeem?ctx=offercodes&id=${TRACKJUMP_APP_STORE_ID}&code=${encodeURIComponent(code)}`;
}

/** Free App Store offer codes on the yearly plan (App Store Connect, subscription 6809550626).
 * They end after the free period with no charge. Change them in App Store Connect, then here. */
export const freeOfferCodes = [
  {code: 'TRYJUMP', terms: '2 months of Pro free', who: 'Anyone who wants to try the app', codes: 500},
  {code: 'JUMPCREW', terms: '1 year of Pro free', who: 'UGC creators', codes: 500},
];

/** What a follower gets, by the plan a code unlocks (TrackJump codes from app 1.1.4 and earlier). */
export function followerOffer(productID: string | null): string {
  if (productID === 'app.trackjump.pro.yearly.creator') return '10% off the yearly plan';
  if (productID === 'app.trackjump.pro.yearly.offer') return 'A lower yearly price';
  return 'A TrackJump discount';
}

export function planName(productID: string | null): string {
  if (!productID) return '—';
  if (productID.includes('weekly')) return 'Weekly';
  return 'Yearly';
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency, maximumFractionDigits: 2}).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'});
}

export function percent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

/** Example numbers for the local preview only (?demo). Never shown in production. */
export const demoSummary: CreatorSummary = {
  creator: {name: 'King Dac', revenueShare: 0.25, shareMonths: 12, holdDays: 30},
  codes: [{code: 'DAC', active: true, discountProductID: 'app.trackjump.pro.yearly.creator', uses: 214}],
  offerCodes: ['KINGDAC'],
  totals: {codeUses: 214, trials: 96, customers: 41, refunds: 2},
  money: [{currency: 'USD', revenue: 1434.59, earned: 304.85, pending: 89.21, paid: 150, payable: 65.64}],
  months: [
    {month: '2026-10', codeUses: 38, customers: 9, revenue: 314.91, earned: 66.92},
    {month: '2026-09', codeUses: 102, customers: 21, revenue: 734.79, earned: 156.14},
    {month: '2026-08', codeUses: 74, customers: 11, revenue: 384.89, earned: 81.79},
  ],
  payouts: [{currency: 'USD', amount: 150, paidAt: '2026-10-01T12:00:00Z', method: 'PayPal'}],
};

/** Example admin data for the local preview only (?demo). */
export const demoAdminOverview: {creators: CreatorSummary[]} = {
  creators: [
    {...demoSummary, creator: {...demoSummary.creator!, id: 'demo-kingdac', email: 'kingdac@example.com', linked: true,
      active: true, proceedsRate: 0.85, note: 'Example creator'},
      codes: demoSummary.codes.map(c => ({...c, id: 'demo-code-dac'})), totals: {...demoSummary.totals, testPurchases: 3}},
    {creator: {id: 'demo-hops', name: 'Hops Academy (example)', email: 'coach@example.com', linked: false, active: true,
      revenueShare: 0.2, shareMonths: 12, proceedsRate: 0.85, holdDays: 30, note: 'Example creator'},
      codes: [{id: 'demo-code-hops', code: 'HOPS', active: true, discountProductID: 'app.trackjump.pro.yearly.creator', uses: 37}],
      totals: {codeUses: 37, trials: 15, customers: 6, refunds: 0},
      money: [{currency: 'USD', revenue: 209.94, earned: 35.69, pending: 11.90, paid: 0, payable: 23.79}],
      months: [{month: '2026-10', codeUses: 37, customers: 6, revenue: 209.94, earned: 35.69}], payouts: []},
  ],
};

/** Example code uses for the local preview only (?demo). */
export const demoCodeUses: CodeUse[] = [
  {redeemedAt: '2026-10-12T15:20:00Z', code: 'DAC', account: null, install: '9f3c21ab', status: 'trial', plan: 'app.trackjump.pro.yearly.creator', currency: 'USD', revenue: 0, earned: 0},
  {redeemedAt: '2026-10-09T18:02:00Z', code: 'DAC', account: 'athlete@example.com', install: '41d0e7c2', status: 'paying', plan: 'app.trackjump.pro.yearly.creator', currency: 'USD', revenue: 34.99, earned: 7.44},
  {redeemedAt: '2026-10-03T11:45:00Z', code: 'DAC', account: null, install: '7be90a14', status: 'no_purchase', plan: null, currency: null, revenue: 0, earned: 0},
  {redeemedAt: '2026-09-21T20:10:00Z', code: 'DAC', account: 'jumper@example.com', install: '0c5512f9', status: 'refunded', plan: 'app.trackjump.pro.yearly.creator', currency: 'USD', revenue: 0, earned: 0},
  {redeemedAt: '2026-09-14T09:30:00Z', code: 'DAC', account: null, install: 'e2a8b6d0', status: 'paying', plan: 'app.trackjump.pro.weekly', currency: 'USD', revenue: 54.39, earned: 11.56},
];

/** A code from a name: letters and digits only, upper case, at most 12 characters. */
export function codeFromName(name: string) {
  return name.normalize('NFKD').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 12)
}

/** One creator per line: "Name, CODE, email". Code and email are optional. */
export function parseCreatorLines(text: string) {
  return text.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [name = '', code = '', email = ''] = line.split(/[,;\t]/).map(part => part.trim())
    const cleanCode = (code ? code.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : codeFromName(name))
    return { name, code: cleanCode, email: email.toLowerCase() }
  })
}
