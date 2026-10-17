"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import type { Session } from "@supabase/supabase-js"
import CreatorSignIn from "@/components/jump/creators/CreatorSignIn"
import {
  creatorOfferTerms, demoAdminOverview, demoCodeUses, followerOffer, formatMoney, offerCodeLink, parseCreatorLines, percent,
  planName, trackJumpClient,
  type CodeUse, type CreatorSummary,
} from "@/lib/trackjump-creators"

type Overview = { creators: CreatorSummary[] }
type Load = { state: "loading" } | { state: "signedOut" } | { state: "notAdmin"; email: string }
  | { state: "ready"; overview: Overview; demo: boolean } | { state: "error"; message: string }

const statusStyle: Record<CodeUse["status"], [string, string]> = {
  paying: ["Paying", "bg-green-500/15 text-green-400"],
  trial: ["In trial", "bg-[#5C8DB8]/20 text-[#8EC5F3]"],
  trial_ended: ["Trial ended", "bg-[#2B2E32] text-[#9B9A97]"],
  ended: ["Cancelled", "bg-[#2B2E32] text-[#9B9A97]"],
  refunded: ["Refunded", "bg-red-500/15 text-red-400"],
  no_purchase: ["No purchase", "bg-[#2B2E32] text-[#6B6A67]"],
}

function sum(creators: CreatorSummary[], pick: (c: CreatorSummary) => number) {
  return creators.reduce((total, c) => total + pick(c), 0)
}
function usd(c: CreatorSummary, key: "revenue" | "earned" | "payable" | "paid" | "pending") {
  return c.money.find(m => m.currency === "USD")?.[key] ?? 0
}

export default function TrackJumpCreatorsAdmin() {
  const [load, setLoad] = useState<Load>({ state: "loading" })
  const [openID, setOpenID] = useState<string | "new" | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)

  const refresh = useCallback(async () => {
    const supabase = trackJumpClient()
    if (!supabase) return
    const { data, error } = await supabase.rpc("creator_admin_overview")
    if (error) {
      setLoad(error.message.includes("not_allowed")
        ? { state: "notAdmin", email: (await supabase.auth.getUser()).data.user?.email ?? "" }
        : { state: "error", message: "The creator data didn't load. Try again in a minute." })
      return
    }
    setLoad({ state: "ready", overview: data as Overview, demo: false })
  }, [])

  useEffect(() => {
    const demo = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("demo")
    const supabase = demo ? null : trackJumpClient()
    const read = (session: Session | null) => { if (!session) setLoad({ state: "signedOut" }); else void refresh() }
    void Promise.resolve().then(() => {
      if (demo) setLoad({ state: "ready", overview: demoAdminOverview, demo: true })
      else if (!supabase) setLoad({ state: "error", message: "TrackJump sign-in isn't configured on this site." })
      else supabase.auth.getSession().then(({ data }) => read(data.session))
    })
    if (!supabase) return
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => read(session))
    return () => listener.subscription.unsubscribe()
  }, [refresh])

  if (load.state === "loading") return <div className="max-w-7xl mx-auto p-6 text-[#9B9A97]">Loading…</div>
  if (load.state === "signedOut") return <div className="p-6 pt-12">
    <CreatorSignIn title="TrackJump admin" intro="TrackJump creator data lives in the TrackJump app's own system. Sign in with your admin email to manage creators." />
  </div>
  if (load.state === "notAdmin") return <div className="max-w-md mx-auto p-6 pt-12">
    <div className="bg-[#1A1A1A] rounded-2xl p-8">
      <h1 className="text-xl font-bold text-white mb-2">Not an admin address</h1>
      <p className="text-sm text-[#9B9A97] mb-5">{load.email} can&apos;t manage TrackJump creators.</p>
      <button onClick={() => void trackJumpClient()?.auth.signOut()} className="text-sm text-[#5C8DB8] hover:underline">Sign in with another email</button>
    </div>
  </div>
  if (load.state === "error") return <div className="max-w-7xl mx-auto p-6">
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{load.message}</div>
  </div>

  const { overview, demo } = load
  const creators = overview.creators
  const open = openID === "new" ? null : creators.find(c => c.creator?.id === openID) ?? null

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {demo && <p className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
        Example data for the local preview. Changes here are not saved.</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">TrackJump Creators</h1>
          <p className="text-[#9B9A97] text-sm sm:text-base">Creator codes, the people who used them, sales and what each creator is owed</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={() => setBulkOpen(true)} className="px-4 py-2 bg-[#2B2E32] hover:bg-[#343941] text-[#8EC5F3] text-sm font-medium rounded-lg transition-colors">
            Add several
          </button>
          <button onClick={() => setOpenID("new")} className="px-4 py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg transition-colors">
            Add creator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <Stat label="Creators" value={String(creators.filter(c => c.creator?.active).length)} hint={`${creators.length} in total`} />
        <Stat label="Code uses" value={sum(creators, c => c.totals.codeUses).toLocaleString("en-US")} />
        <Stat label="Paying customers" value={sum(creators, c => c.totals.customers).toLocaleString("en-US")} tone="text-green-400" />
        <Stat label="Sales (USD)" value={formatMoney(sum(creators, c => usd(c, "revenue")), "USD")} />
        <Stat label="Owed now (USD)" value={formatMoney(sum(creators, c => usd(c, "payable")), "USD")} tone="text-yellow-400"
          hint={`${formatMoney(sum(creators, c => usd(c, "paid")), "USD")} paid so far`} />
      </div>

      <div className="bg-[#1A1A1A] rounded-xl overflow-x-auto">
        {creators.length === 0 ? <div className="p-8 text-center text-[#9B9A97]">No creators yet. Add one to create their code.</div> :
          <table className="w-full min-w-[1000px]">
            <thead><tr className="border-b border-[#3D3D3D]">
              {["Creator", "Code", "Terms", "Code uses", "Trials", "Paying", "Sales", "Earned", "Owed now", ""].map((h, i) =>
                <th key={h || i} className={`px-4 py-3 text-sm font-medium text-[#9B9A97] ${i >= 3 && i <= 8 ? "text-right" : "text-left"}`}>{h}</th>)}
            </tr></thead>
            <tbody>{creators.map(c => {
              const t = c.creator!
              const main = c.money[0]
              return <tr key={t.id} className="border-b border-[#2B2E32] hover:bg-[#2B2E32]/50">
                <td className="px-4 py-3 align-top">
                  <p className="text-white font-medium">{t.name}{!t.active && <span className="ml-2 rounded bg-[#2B2E32] px-2 py-0.5 text-xs text-[#9B9A97]">Paused</span>}</p>
                  <p className="text-xs text-[#9B9A97]">{t.email ?? "No email"}{t.linked ? " · signed in" : ""}</p>
                </td>
                <td className="px-4 py-3 align-top">{(c.offerCodes ?? []).map(code =>
                  <span key={`offer-${code}`} title="App Store offer code" className="mr-1 inline-block rounded bg-[#5C8DB8]/25 px-2 py-1 font-mono text-sm text-white">{code}</span>)}
                  {c.codes.map(code =>
                  <span key={code.code} title="TrackJump code (app 1.1.4 and earlier)" className={`mr-1 inline-block rounded px-2 py-1 font-mono text-sm ${code.active ? "bg-[#2B2E32] text-[#9B9A97]" : "bg-[#2B2E32]/50 text-[#6B6A67] line-through"}`}>{code.code}</span>)}
                  {!(c.offerCodes ?? []).length && <p className="mt-1 text-xs text-yellow-400">No App Store code</p>}</td>
                <td className="px-4 py-3 align-top text-sm text-[#C9D4DE]">{percent(t.revenueShare)} · {t.shareMonths} mo<p className="text-xs text-[#6B6A67]">{t.holdDays}-day hold</p></td>
                <td className="px-4 py-3 align-top text-right text-white tabular-nums">{c.totals.codeUses}</td>
                <td className="px-4 py-3 align-top text-right text-white tabular-nums">{c.totals.trials}</td>
                <td className="px-4 py-3 align-top text-right text-green-400 tabular-nums">{c.totals.customers}</td>
                <td className="px-4 py-3 align-top text-right text-white tabular-nums">{main ? formatMoney(main.revenue, main.currency) : "—"}</td>
                <td className="px-4 py-3 align-top text-right text-white tabular-nums">{main ? formatMoney(main.earned, main.currency) : "—"}</td>
                <td className="px-4 py-3 align-top text-right text-yellow-400 tabular-nums">{main ? formatMoney(main.payable, main.currency) : "—"}
                  {c.money.length > 1 && <p className="text-xs text-[#6B6A67]">+{c.money.length - 1} currencies</p>}</td>
                <td className="px-4 py-3 align-top text-right">
                  <button onClick={() => setOpenID(t.id!)} className="rounded-lg bg-[#2B2E32] px-3 py-2 text-sm font-medium text-[#8EC5F3] hover:bg-[#343941]">Open</button>
                </td>
              </tr>
            })}</tbody>
          </table>}
      </div>
      <p className="mt-4 text-xs text-[#6B6A67]">Earnings are estimates: price × Apple&apos;s payout rate × the creator&apos;s share. Test purchases, free trials and refunds earn nothing.</p>

      {bulkOpen && <BulkCreatorsPanel demo={demo} creators={creators} onClose={() => setBulkOpen(false)}
        onSaved={o => setLoad({ state: "ready", overview: o, demo: false })} />}
      {openID && <CreatorPanel summary={open} demo={demo} onClose={() => setOpenID(null)}
        onSaved={(o, id) => { setLoad({ state: "ready", overview: o, demo: false }); if (id) setOpenID(id) }} />}
    </div>
  )
}

function Stat({ label, value, hint, tone = "text-white" }: { label: string; value: string; hint?: string; tone?: string }) {
  return <div className="bg-[#1A1A1A] rounded-xl p-4 min-w-0">
    <p className="text-sm text-[#9B9A97]">{label}</p>
    <p className={`truncate text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
    {hint && <p className="text-xs text-[#6B6A67] mt-0.5">{hint}</p>}
  </div>
}

type BulkResult = { name: string; code: string; ok: boolean; note: string }

/** Creates many creators and their codes in one go, on the default terms. */
function BulkCreatorsPanel({ demo, creators, onClose, onSaved }: {
  demo: boolean; creators: CreatorSummary[]; onClose: () => void; onSaved: (o: Overview) => void
}) {
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<BulkResult[]>([])
  const rows = useMemo(() => parseCreatorLines(text), [text])

  async function create() {
    if (demo) { setResults([{ name: "Example", code: "", ok: false, note: "Example data: nothing was saved." }]); return }
    const supabase = trackJumpClient()!
    setBusy(true); setResults([])
    let known = new Set(creators.map(c => c.creator?.id))
    const done: BulkResult[] = []
    for (const row of rows) {
      if (!row.name) { done.push({ ...row, ok: false, note: "Missing name" }); continue }
      if (!/^[A-Z0-9]{3,24}$/.test(row.code)) { done.push({ ...row, ok: false, note: "Codes are 3–24 letters or digits" }); continue }
      const saved = await supabase.rpc("creator_admin_save", {
        p_id: null, p_name: row.name, p_email: row.email || null, p_revenue_share: 0.25, p_share_months: 12,
        p_proceeds_rate: 0.85, p_hold_days: 30, p_active: true, p_note: "",
      })
      if (saved.error) { done.push({ ...row, ok: false, note: saved.error.message.includes("duplicate") ? "Email already used" : "Couldn't add creator" }); setResults([...done]); continue }
      const after = (saved.data as Overview).creators
      const id = after.map(c => c.creator?.id).find(x => x && !known.has(x))
      known = new Set(after.map(c => c.creator?.id))
      const coded = await supabase.rpc("creator_admin_add_code", { p_creator_id: id, p_code: row.code })
      if (coded.error) {
        done.push({ ...row, ok: false, note: coded.error.message.includes("code_taken") ? "Creator added, but the code is taken: open them and add another" : "Creator added, code failed" })
        onSaved(saved.data as Overview)
      } else {
        done.push({ ...row, ok: true, note: "Added" })
        onSaved(coded.data as Overview)
      }
      setResults([...done])
    }
    setBusy(false)
  }

  // Followers can only use an App Store offer code, so the message assumes one
  // with the same name exists and is linked (see the creator's panel).
  const message = results.filter(r => r.ok).map(r =>
    `${r.name}: your TrackJump code is ${r.code}. Your followers get ${creatorOfferTerms} when they redeem it in the App Store: ${offerCodeLink(r.code)} . You can follow sign-ups and earnings at mytrackspeed.com/jump/creators (sign in with the email you gave me).`).join("\n\n")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-6 z-50" onClick={onClose}>
      <div className="bg-[#1A1A1A] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-w-3xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Add several creators</h2>
            <p className="text-sm text-[#9B9A97]">One per line: <span className="font-mono text-[#C9D4DE]">Name, CODE, email</span>. Code and email are optional; without a code, one is made from the name. Everyone starts on 25% for 12 months, which you can change per creator afterwards.</p>
          </div>
          <button onClick={onClose} className="text-[#9B9A97] hover:text-white text-sm">Close</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className={`${input} font-mono`}
          placeholder={"King Dac, DAC, dac@example.com\nJane Jumps, JANE\nMike Hops"} />
        {rows.length > 0 && <div className="mt-3 rounded-lg border border-[#3D3D3D] bg-[#202327] p-3 text-sm">
          {rows.map((r, i) => {
            const result = results[i]
            return <div key={i} className="flex flex-wrap items-center gap-2 py-1">
              <span className="text-white">{r.name || "—"}</span>
              <span className="rounded bg-[#2B2E32] px-2 py-0.5 font-mono text-[#C9D4DE]">{r.code || "no code"}</span>
              {r.email && <span className="text-[#9B9A97]">{r.email}</span>}
              {result && <span className={result.ok ? "text-green-400" : "text-yellow-400"}>{result.note}</span>}
            </div>
          })}
        </div>}
        <div className="mt-4 flex gap-2">
          <button disabled={busy || rows.length === 0} onClick={() => void create()}
            className="px-4 py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] disabled:opacity-50 text-white text-sm font-medium rounded-lg">
            {busy ? "Adding…" : `Add ${rows.length || ""} ${rows.length === 1 ? "creator" : "creators"}`}
          </button>
        </div>
        {message && <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">Message to send each creator</p>
            <p className="text-xs text-yellow-400">Send it only after each code exists in App Store Connect and is linked.</p>
            <button onClick={() => void navigator.clipboard.writeText(message)} className="text-sm text-[#8EC5F3] hover:underline">Copy</button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-[#202327] p-3 text-sm text-[#C9D4DE]">{message}</pre>
        </div>}
      </div>
    </div>
  )
}

const input = "w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm focus:outline-none focus:border-[#5C8DB8]"
const box = "rounded-lg border border-[#3D3D3D] bg-[#202327] p-4"

function CreatorPanel({ summary, demo, onClose, onSaved }: {
  summary: CreatorSummary | null; demo: boolean; onClose: () => void; onSaved: (o: Overview, id?: string) => void
}) {
  const t = summary?.creator
  const [form, setForm] = useState({
    name: t?.name ?? "", email: t?.email ?? "", share: String(Math.round((t?.revenueShare ?? 0.25) * 100)),
    months: String(t?.shareMonths ?? 12), proceeds: String(Math.round((t?.proceedsRate ?? 0.85) * 100)),
    hold: String(t?.holdDays ?? 30), active: t?.active ?? true, note: t?.note ?? "",
  })
  const [newCode, setNewCode] = useState("")
  const [offer, setOffer] = useState({ code: "", name: "" })
  const [payout, setPayout] = useState({ amount: "", currency: summary?.money[0]?.currency ?? "USD", method: "PayPal", reference: "" })
  const [uses, setUses] = useState<CodeUse[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!t?.id) return
    if (demo) { void Promise.resolve(demoCodeUses).then(setUses); return }
    trackJumpClient()?.rpc("creator_admin_code_uses", { p_creator_id: t.id }).then(({ data, error }) => setUses(error ? [] : data as CodeUse[]))
  }, [t?.id, demo])

  async function call(fn: string, args: Record<string, unknown>, done: string, pickID = false) {
    if (demo) { setMessage("Example data: nothing was saved."); return }
    setBusy(true); setMessage(null)
    const { data, error } = await trackJumpClient()!.rpc(fn, args)
    setBusy(false)
    if (error) {
      setMessage(error.message.includes("code_taken") ? "That code is already in use." : error.message.includes("invalid_code")
        ? "Codes are 3–24 letters or digits." : "That didn't save. Check the values and try again.")
      return
    }
    const overview = data as Overview
    const id = pickID ? overview.creators.find(c => c.creator?.name === form.name.trim())?.creator?.id : undefined
    onSaved(overview, id); setMessage(done)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    void call("creator_admin_save", {
      p_id: t?.id ?? null, p_name: form.name, p_email: form.email || null,
      p_revenue_share: Number(form.share) / 100, p_share_months: Number(form.months),
      p_proceeds_rate: Number(form.proceeds) / 100, p_hold_days: Number(form.hold), p_active: form.active, p_note: form.note,
    }, t ? "Saved. New terms apply to new customers." : "Creator added. Now give them a code.", !t)
  }

  const totals = useMemo(() => uses ? {
    paying: uses.filter(u => u.status === "paying").length, trial: uses.filter(u => u.status === "trial").length,
  } : null, [uses])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:p-6 z-50" onClick={onClose}>
      <div className="bg-[#1A1A1A] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">{t ? t.name : "Add creator"}</h2>
            {t && <p className="text-sm text-[#9B9A97]">{summary!.totals.codeUses} code uses · {summary!.totals.customers} paying · {summary!.totals.refunds} refunded</p>}
          </div>
          <button onClick={onClose} className="text-[#9B9A97] hover:text-white text-sm">Close</button>
        </div>
        {message && <p className="mb-4 rounded-lg bg-[#2B2E32] px-4 py-2 text-sm text-[#C9D4DE]">{message}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <form onSubmit={save} className={`${box} space-y-3`}>
            <p className="text-sm font-medium text-white">Creator and terms</p>
            <Field label="Name"><input id="cr-name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={input} /></Field>
            <Field label="Sign-in email (for their dashboard)"><input id="cr-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={input} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Share %"><input id="cr-share" type="number" min="0" max="100" step="0.5" required value={form.share} onChange={e => setForm({ ...form, share: e.target.value })} className={input} /></Field>
              <Field label="Months per customer"><input id="cr-months" type="number" min="1" max="120" required value={form.months} onChange={e => setForm({ ...form, months: e.target.value })} className={input} /></Field>
              <Field label="Apple payout %"><input id="cr-proceeds" type="number" min="1" max="100" required value={form.proceeds} onChange={e => setForm({ ...form, proceeds: e.target.value })} className={input} /></Field>
              <Field label="Refund hold (days)"><input id="cr-hold" type="number" min="0" max="365" required value={form.hold} onChange={e => setForm({ ...form, hold: e.target.value })} className={input} /></Field>
            </div>
            <Field label="Note"><input id="cr-note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className={input} placeholder="TikTok @kingdac, 120k" /></Field>
            <label className="flex items-center gap-2 text-sm text-[#C9D4DE]"><input id="cr-active" type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active (new customers can be credited)</label>
            <button disabled={busy} className="w-full py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg disabled:opacity-50">{t ? "Save changes" : "Add creator"}</button>
          </form>

          <div className="space-y-3">
            {t && <form className={box} onSubmit={e => {
                e.preventDefault()
                const code = offer.code.trim().toUpperCase(), name = offer.name.trim()
                void (async () => {
                  // Apple's signed purchase names either the custom code or the offer, so link both.
                  if (name) await call("creator_admin_link_offer_code", { p_creator_id: t.id, p_offer_identifier: name, p_note: `Offer for ${code}` }, "")
                  await call("creator_admin_link_offer_code", { p_creator_id: t.id, p_offer_identifier: code, p_note: "Custom code", p_customer_code: true }, `App Store code ${code} linked.`)
                })()
                setOffer({ code: "", name: "" })
              }}>
              <p className="text-sm font-medium text-white mb-1">App Store code</p>
              {(summary!.offerCodes ?? []).length ? <div className="mb-3 space-y-1">{summary!.offerCodes!.map(code =>
                <div key={code} className="flex items-center justify-between gap-3">
                  <p className="font-mono text-white">{code} <span className="text-xs text-[#9B9A97]">· {creatorOfferTerms}</span></p>
                  <button type="button" onClick={() => void navigator.clipboard.writeText(offerCodeLink(code))} className="shrink-0 text-sm text-[#8EC5F3] hover:underline">Copy link</button>
                </div>)}</div> :
                <p className="mb-3 text-xs text-[#9B9A97]">Followers can only use an App Store offer code. Create a custom code on the yearly plan in App Store Connect (Subscriptions → Offer Codes), then link it here with the offer&apos;s name.</p>}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input id="cr-offer-code" required value={offer.code} onChange={e => setOffer({ ...offer, code: e.target.value })} placeholder="KINGDAC" className={`${input} font-mono uppercase`} />
                <input id="cr-offer-name" value={offer.name} onChange={e => setOffer({ ...offer, name: e.target.value })} placeholder="Offer name: creator-DAC" className={input} />
              </div>
              <button disabled={busy || !offer.code.trim()} className="w-full py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg disabled:opacity-50">Link App Store code</button>
            </form>}
            {t && <div className={box}>
              <p className="text-sm font-medium text-white mb-1">TrackJump codes</p>
              <p className="text-xs text-[#6B6A67] mb-3">Only app 1.1.4 and earlier accept these. Sales still report under this code.</p>
              <div className="space-y-2 mb-3">{summary!.codes.length === 0 ? <p className="text-sm text-[#9B9A97]">No code yet.</p> :
                summary!.codes.map(code => <div key={code.code} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-white">{code.code} <span className="text-xs text-[#9B9A97]">· {code.uses} uses</span></p>
                    <p className="text-xs text-[#6B6A67]">{followerOffer(code.discountProductID)}</p>
                  </div>
                  <button disabled={busy} onClick={() => call("creator_admin_set_code", { p_code_id: code.id, p_active: !code.active }, code.active ? "Code paused." : "Code active again.")}
                    className="shrink-0 rounded bg-[#2B2E32] px-3 py-1.5 text-sm text-[#C9D4DE] hover:bg-[#343941]">{code.active ? "Pause" : "Resume"}</button>
                </div>)}</div>
              <form onSubmit={e => { e.preventDefault(); void call("creator_admin_add_code", { p_creator_id: t.id, p_code: newCode }, `Code ${newCode.toUpperCase()} created.`); setNewCode("") }} className="flex gap-2">
                <input id="cr-new-code" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="DAC" className={`${input} font-mono uppercase`} />
                <button disabled={busy || !newCode.trim()} className="shrink-0 px-3 py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg disabled:opacity-50">Add code</button>
              </form>
            </div>}
            {t && <form className={box} onSubmit={e => { e.preventDefault(); void call("creator_admin_record_payout", {
                p_creator_id: t.id, p_currency: payout.currency, p_amount: Number(payout.amount), p_method: payout.method, p_reference: payout.reference,
              }, "Payout recorded."); setPayout({ ...payout, amount: "", reference: "" }) }}>
              <p className="text-sm font-medium text-white mb-1">Record a payout</p>
              <p className="text-xs text-[#9B9A97] mb-3">{summary!.money.map(m => `${formatMoney(m.payable, m.currency)} owed now`).join(" · ") || "Nothing owed yet"}. Send the money first, then record it here.</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input id="cr-payout-amount" type="number" min="0.01" step="0.01" required placeholder="Amount" value={payout.amount} onChange={e => setPayout({ ...payout, amount: e.target.value })} className={`${input} col-span-2`} />
                <input id="cr-payout-currency" required value={payout.currency} onChange={e => setPayout({ ...payout, currency: e.target.value.toUpperCase().slice(0, 3) })} className={`${input} uppercase`} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input id="cr-payout-method" value={payout.method} onChange={e => setPayout({ ...payout, method: e.target.value })} placeholder="PayPal" className={input} />
                <input id="cr-payout-ref" value={payout.reference} onChange={e => setPayout({ ...payout, reference: e.target.value })} placeholder="Reference" className={input} />
              </div>
              <button disabled={busy} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">Record payout</button>
            </form>}
          </div>
        </div>

        {t && <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm font-medium text-white">Everyone who used {summary!.codes.map(c => c.code).join(" / ") || "the code"}</p>
            {totals && <p className="text-xs text-[#9B9A97]">{totals.paying} paying · {totals.trial} in trial</p>}
          </div>
          <div className="rounded-lg border border-[#3D3D3D] overflow-x-auto">
            {uses === null ? <p className="p-4 text-sm text-[#9B9A97]">Loading…</p> : uses.length === 0 ? <p className="p-4 text-sm text-[#9B9A97]">Nobody has used this code yet.</p> :
              <table className="w-full min-w-[720px] text-sm tabular-nums">
                <thead><tr className="border-b border-[#3D3D3D] text-[#9B9A97]">
                  <th className="px-3 py-2 text-left font-normal">Used</th><th className="px-3 py-2 text-left font-normal">Code</th>
                  <th className="px-3 py-2 text-left font-normal">Person</th><th className="px-3 py-2 text-left font-normal">Status</th>
                  <th className="px-3 py-2 text-left font-normal">Plan</th><th className="px-3 py-2 text-right font-normal">Paid</th>
                  <th className="px-3 py-2 text-right font-normal">Creator earned</th>
                </tr></thead>
                <tbody>{uses.map((u, i) => <tr key={i} className="border-b border-[#2B2E32] last:border-0">
                  <td className="px-3 py-2 text-[#C9D4DE]">{new Date(u.redeemedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-3 py-2 font-mono text-white">{u.code}</td>
                  <td className="px-3 py-2 text-[#C9D4DE]">{u.account ?? <span className="text-[#6B6A67]">Guest · install {u.install}</span>}</td>
                  <td className="px-3 py-2"><span className={`rounded px-2 py-0.5 text-xs ${statusStyle[u.status][1]}`}>{statusStyle[u.status][0]}</span></td>
                  <td className="px-3 py-2 text-[#C9D4DE]">{planName(u.plan)}</td>
                  <td className="px-3 py-2 text-right text-white">{u.currency ? formatMoney(u.revenue, u.currency) : "—"}</td>
                  <td className="px-3 py-2 text-right text-green-400">{u.currency ? formatMoney(u.earned, u.currency) : "—"}</td>
                </tr>)}</tbody>
              </table>}
          </div>
        </div>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs text-[#9B9A97] mb-1">{label}</span>{children}</label>
}
