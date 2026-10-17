'use client';

import {useEffect, useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import CreatorSignIn from './CreatorSignIn';
import {
  creatorOfferTerms, demoSummary, followerOffer, formatMoney, formatMonth, offerCodeLink, percent, trackJumpClient,
  type CreatorSummary,
} from '@/lib/trackjump-creators';

type Load = {state: 'loading'} | {state: 'signedOut'} | {state: 'notCreator'; email: string}
  | {state: 'ready'; summary: CreatorSummary; demo: boolean} | {state: 'error'};

export default function CreatorDashboard() {
  const [load, setLoad] = useState<Load>({state: 'loading'});

  useEffect(() => {
    const demo = process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).has('demo');
    const supabase = demo ? null : trackJumpClient();
    if (!supabase) {
      void Promise.resolve().then(() => setLoad(demo ? {state: 'ready', summary: demoSummary, demo: true} : {state: 'signedOut'}));
      return;
    }
    let active = true;
    async function read(session: Session | null) {
      if (!session) {if (active) setLoad({state: 'signedOut'}); return;}
      const {data, error} = await supabase!.rpc('creator_dashboard');
      if (!active) return;
      if (error) {setLoad({state: 'error'}); return;}
      const summary = data as CreatorSummary;
      setLoad(summary?.creator ? {state: 'ready', summary, demo: false} : {state: 'notCreator', email: session.user.email ?? ''});
    }
    supabase.auth.getSession().then(({data}) => read(data.session));
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {void read(session);});
    return () => {active = false; listener.subscription.unsubscribe();};
  }, []);

  async function signOut() {
    await trackJumpClient()?.auth.signOut();
    setLoad({state: 'signedOut'});
  }

  return <div className="min-h-screen bg-[#0F0F0F] px-4 pb-20 pt-28 text-white sm:px-6">
    {load.state === 'loading' && <p className="mx-auto max-w-5xl text-[#9B9A97]">Loading…</p>}
    {load.state === 'signedOut' && <CreatorSignIn title="Your creator dashboard"
      intro="Sign in with the email address you gave TrackJump to see who used your code, your paying customers and your earnings." />}
    {load.state === 'notCreator' && <Notice title="No creator code on this account"
      body={`${load.email} isn't linked to a TrackJump creator code yet. If you're in the creator program, sign in with the address you gave us, or email support@mytrackspeed.com.`}
      action={<button onClick={signOut} className="text-sm text-[#5C8DB8] hover:underline">Sign in with another email</button>} />}
    {load.state === 'error' && <Notice title="Your numbers didn't load"
      body="Something went wrong on our side. Reload the page in a minute." action={null} />}
    {load.state === 'ready' && <Dashboard summary={load.summary} demo={load.demo} onSignOut={signOut} />}
  </div>;
}

function Notice({title, body, action}: {title: string; body: string; action: React.ReactNode}) {
  return <div className="mx-auto max-w-md rounded-2xl bg-[#1A1A1A] p-8">
    <h1 className="mb-2 text-xl font-bold">{title}</h1>
    <p className="mb-5 text-sm leading-6 text-[#9B9A97]">{body}</p>
    {action}
  </div>;
}

function Dashboard({summary, demo, onSignOut}: {summary: CreatorSummary; demo: boolean; onSignOut: () => void}) {
  const creator = summary.creator!;
  const [copied, setCopied] = useState<string | null>(null);
  const money = summary.money.length ? summary.money : [{currency: 'USD', revenue: 0, earned: 0, pending: 0, paid: 0, payable: 0}];
  // Creators share App Store offer codes. Their old TrackJump code shows only until they have one.
  const offerCodes = summary.offerCodes ?? [];

  function copy(code: string) {
    navigator.clipboard?.writeText(code).then(() => {setCopied(code); setTimeout(() => setCopied(null), 1500);}).catch(() => {});
  }

  return <div className="mx-auto max-w-5xl">
    {demo && <p className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
      Example numbers for the local preview. Real creators see their own.</p>}
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5C8DB8]">TrackJump creators</p>
        <h1 className="text-3xl font-bold">Welcome, {creator.name}</h1>
      </div>
      {!demo && <button onClick={onSignOut} className="text-sm text-[#9B9A97] hover:text-white">Sign out</button>}
    </div>

    <div className="mb-6 grid gap-4 md:grid-cols-2">
      {offerCodes.map(code => <div key={code} className="rounded-2xl border border-[#5C8DB8]/20 bg-[#1A1A1A] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-sm text-[#9B9A97]">Your code</p>
            <p className="break-all font-mono text-4xl font-bold tracking-wider">{code}</p>
            <p className="mt-2 text-sm text-[#9B9A97]">{creatorOfferTerms} for anyone who redeems it in the App Store.</p>
          </div>
          <button onClick={() => copy(code)} className="shrink-0 rounded-lg bg-[#5C8DB8] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#4A7A9E]">
            {copied === code ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-[#202327] px-3 py-2">
          <p className="min-w-0 truncate text-xs text-[#9B9A97]">{offerCodeLink(code)}</p>
          <button onClick={() => copy(offerCodeLink(code))} className="shrink-0 text-sm text-[#5C8DB8] hover:underline">
            {copied === offerCodeLink(code) ? 'Copied' : 'Copy link'}
          </button>
        </div>
        <p className="mt-2 text-xs text-[#6B6A67]">Put the link in your bio or captions: it opens the App Store with your code filled in.</p>
      </div>)}
      {offerCodes.length === 0 && summary.codes.map(code => <div key={code.code} className="rounded-2xl border border-[#5C8DB8]/20 bg-[#1A1A1A] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-sm text-[#9B9A97]">Your code</p>
            <p className="font-mono text-4xl font-bold tracking-wider">{code.code}</p>
            <p className="mt-2 text-sm text-[#9B9A97]">{code.active ? followerOffer(code.discountProductID) + ' for anyone who enters it in TrackJump.' : 'This code is paused.'}</p>
          </div>
          <button onClick={() => copy(code.code)} className="shrink-0 rounded-lg bg-[#5C8DB8] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#4A7A9E]">
            {copied === code.code ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>)}
      <div className="rounded-2xl bg-[#1A1A1A] p-6 text-sm leading-6 text-[#9B9A97]">
        <p className="mb-1 text-white">How you earn</p>
        You earn <span className="text-white">{percent(creator.revenueShare)}</span> of what Apple pays us for every purchase
        a customer makes in the <span className="text-white">{creator.shareMonths} months</span> after they redeem your code, renewals included.
        Each earning can be paid <span className="text-white">{creator.holdDays} days</span> after the purchase, once refunds have settled.
      </div>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat label="Code uses" value={summary.totals.codeUses.toLocaleString('en-US')} hint="People who redeemed your code" />
      <Stat label="Free trials" value={summary.totals.trials.toLocaleString('en-US')} hint="Started a trial" />
      <Stat label="Paying customers" value={summary.totals.customers.toLocaleString('en-US')} hint={summary.totals.refunds ? `${summary.totals.refunds} refunded` : 'Paid at least once'} />
      <Stat label="Conversion" value={summary.totals.codeUses ? percent(summary.totals.customers / summary.totals.codeUses) : '—'} hint="Code uses that paid" />
    </div>

    {money.map(m => <div key={m.currency} className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat label="Earned" value={formatMoney(m.earned, m.currency)} tone="text-green-400" hint={`From ${formatMoney(m.revenue, m.currency)} in sales`} />
      <Stat label="Waiting for refund window" value={formatMoney(m.pending, m.currency)} tone="text-yellow-400" hint={`Payable after ${creator.holdDays} days`} />
      <Stat label="Ready to pay" value={formatMoney(m.payable, m.currency)} tone="text-[#5C8DB8]" hint="Included in the next payout" />
      <Stat label="Paid to you" value={formatMoney(m.paid, m.currency)} hint={summary.payouts.length ? `${summary.payouts.length} payout${summary.payouts.length === 1 ? '' : 's'}` : 'No payouts yet'} />
    </div>)}

    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="min-w-0 rounded-2xl bg-[#1A1A1A] p-6">
        <h2 className="mb-4 text-lg font-semibold">By month</h2>
        {summary.months.length === 0 ? <p className="text-sm text-[#9B9A97]">Nobody has used your code yet. Numbers appear here as soon as someone does.</p> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="text-left text-[#9B9A97]">
                <th className="py-2 pr-4 font-normal">Month</th><th className="py-2 pr-4 text-right font-normal">Code uses</th>
                <th className="py-2 pr-4 text-right font-normal">New customers</th><th className="py-2 pr-4 text-right font-normal">Sales</th>
                <th className="py-2 text-right font-normal">You earned</th>
              </tr></thead>
              <tbody>{summary.months.map(row => <tr key={row.month} className="border-t border-[#2B2E32]">
                <td className="py-2 pr-4">{formatMonth(row.month)}</td>
                <td className="py-2 pr-4 text-right">{row.codeUses}</td>
                <td className="py-2 pr-4 text-right">{row.customers}</td>
                <td className="py-2 pr-4 text-right">{formatMoney(row.revenue, money[0].currency)}</td>
                <td className="py-2 text-right text-green-400">{formatMoney(row.earned, money[0].currency)}</td>
              </tr>)}</tbody>
            </table>
          </div>}
      </section>
      <section className="min-w-0 rounded-2xl bg-[#1A1A1A] p-6">
        <h2 className="mb-4 text-lg font-semibold">Payouts</h2>
        {summary.payouts.length === 0 ? <p className="text-sm text-[#9B9A97]">Your first payout appears here once earnings pass the refund window.</p> :
          <ul className="space-y-3 text-sm">{summary.payouts.map((p, i) => <li key={i} className="flex justify-between gap-4 border-b border-[#2B2E32] pb-3 last:border-0">
            <span className="text-[#9B9A97]">{new Date(p.paidAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}{p.method ? ` · ${p.method}` : ''}</span>
            <span className="tabular-nums">{formatMoney(p.amount, p.currency)}</span>
          </li>)}</ul>}
      </section>
    </div>
    <p className="mt-8 text-xs leading-5 text-[#6B6A67]">Customers stay anonymous: you see counts and money, never who they are. Earnings are estimates until paid; prices that include sales tax or VAT pay slightly less.</p>
  </div>;
}

function Stat({label, value, hint, tone = 'text-white'}: {label: string; value: string; hint: string; tone?: string}) {
  return <div className="min-w-0 rounded-xl bg-[#1A1A1A] p-5">
    <p className="mb-1 text-sm text-[#9B9A97]">{label}</p>
    <p className={`truncate text-2xl font-bold tabular-nums sm:text-3xl ${tone}`}>{value}</p>
    <p className="mt-1 text-xs text-[#6B6A67]">{hint}</p>
  </div>;
}
