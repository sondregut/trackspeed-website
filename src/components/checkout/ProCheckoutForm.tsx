"use client"

import { FormEvent, useMemo, useState } from "react"
import { ArrowRight, Check, LockKeyhole, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Plan = "annual" | "weekly"
type Mode = "sign-up" | "sign-in"

const APP_STORE_URL = "https://apps.apple.com/app/trackspeed/id6757509163"

const PLANS: Record<
  Plan,
  { name: string; price: string; cadence: string; note: string }
> = {
  annual: {
    name: "Annual",
    price: "$59.99",
    cadence: "per year",
    note: "Best for athletes and coaches who will use TrackSpeed all season.",
  },
  weekly: {
    name: "Weekly",
    price: "$7.99",
    cadence: "per week",
    note: "Use this when you only need Pro for a short testing block.",
  },
}

function normalizePlan(plan: string | undefined): Plan {
  return plan === "weekly" ? "weekly" : "annual"
}

function getInitialPlan({
  initialPlan,
  availablePlans,
}: {
  initialPlan: string | undefined
  availablePlans: Record<Plan, boolean>
}): Plan {
  const normalized = normalizePlan(initialPlan)

  if (availablePlans[normalized]) return normalized
  if (availablePlans.annual) return "annual"
  return "weekly"
}

export default function ProCheckoutForm({
  initialPlan,
  availablePlans = { annual: true, weekly: true },
}: {
  initialPlan?: string
  availablePlans?: Record<Plan, boolean>
}) {
  const [plan, setPlan] = useState<Plan>(() =>
    getInitialPlan({ initialPlan, availablePlans })
  )
  const [mode, setMode] = useState<Mode>("sign-up")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedPlan = useMemo(() => PLANS[plan], [plan])
  const visiblePlans = useMemo(
    () => (Object.keys(PLANS) as Plan[]).filter((planId) => availablePlans[planId]),
    [availablePlans]
  )
  const hasAnyAvailablePlan = visiblePlans.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!hasAnyAvailablePlan) {
      setError("Open TrackSpeed and upgrade through the app paywall for now.")
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedConfirmEmail = confirmEmail.trim().toLowerCase()

    if (mode === "sign-up" && normalizedEmail !== normalizedConfirmEmail) {
      setError("The two email fields need to match.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/checkout/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          plan,
          email: normalizedEmail,
          password,
        }),
      })

      const data = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !data.url) {
        setError(data.error || "Could not start checkout.")
        return
      }

      window.location.assign(data.url)
    } catch {
      setError("Checkout could not start. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-w-0 rounded-[28px] border border-[#DCE5EE] bg-white p-5 shadow-[0_18px_50px_-30px_rgba(14,24,35,0.45)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5C8DB8]">
            {hasAnyAvailablePlan ? "Web checkout" : "App checkout"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0E0E0C]">
            {hasAnyAvailablePlan ? "Start TrackSpeed Pro" : "Start Pro in TrackSpeed"}
          </h2>
        </div>
        <div className="rounded-full border border-[#DCE5EE] bg-[#F7FAFC] p-2 text-[#5C8DB8]">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {!hasAnyAvailablePlan ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#F7FAFC] px-4 py-4">
            <p className="text-sm leading-6 text-[#5B6470]">
              Online checkout is being prepared. For now, open TrackSpeed and
              upgrade through the app paywall so Pro unlocks immediately on your
              iPhone.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="trackspeed://subscribe"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0E0E0C] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#26303E] active:scale-[0.99]"
            >
              Open app paywall
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={APP_STORE_URL}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#DCE5EE] bg-white px-5 text-sm font-semibold text-[#26303E] transition-colors hover:border-[#BFD2E2] active:scale-[0.99]"
            >
              Download TrackSpeed
            </a>
          </div>

          <p className="text-center text-xs leading-5 text-[#697483]">
            After upgrading in the app, Pro stays tied to the TrackSpeed account
            you use there.
          </p>
        </div>
      ) : (
        <>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visiblePlans.map((planId) => {
          const option = PLANS[planId]
          const active = plan === planId

          return (
            <button
              key={planId}
              type="button"
              onClick={() => setPlan(planId)}
              className={`min-w-0 rounded-2xl border p-4 text-left transition-[border-color,background-color,transform] active:scale-[0.99] ${
                active
                  ? "border-[#5C8DB8] bg-[#F4FAFD]"
                  : "border-[#E6EAF0] bg-white hover:border-[#BFD2E2]"
              }`}
              aria-pressed={active}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#0E0E0C]">
                  {option.name}
                </span>
                {active && <Check className="h-4 w-4 text-[#5C8DB8]" aria-hidden="true" />}
              </span>
              <span className="mt-3 block text-2xl font-bold text-[#0E0E0C]">
                {option.price}
              </span>
              <span className="text-xs text-[#5B6470]">{option.cadence}</span>
            </button>
          )
        })}
      </div>

      <p className="mb-5 rounded-2xl bg-[#F7FAFC] px-4 py-3 text-sm leading-6 text-[#5B6470]">
        {selectedPlan.note}
      </p>

      <div className="mb-5 grid grid-cols-2 rounded-full bg-[#F1F5F8] p-1">
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
            mode === "sign-up"
              ? "bg-white text-[#0E0E0C] shadow-sm"
              : "text-[#5B6470]"
          }`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
            mode === "sign-in"
              ? "bg-white text-[#0E0E0C] shadow-sm"
              : "text-[#5B6470]"
          }`}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="checkout-email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96A3]" aria-hidden="true" />
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-11 rounded-xl bg-white pl-9"
              placeholder="you@example.com"
              required
            />
          </div>
          <p className="text-xs leading-5 text-[#697483]">
            Use this email when you sign into the app after purchase.
          </p>
        </div>

        {mode === "sign-up" && (
          <div className="space-y-2">
            <Label htmlFor="checkout-confirm-email">Confirm email</Label>
            <Input
              id="checkout-confirm-email"
              type="email"
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              autoComplete="email"
              className="h-11 rounded-xl bg-white"
              placeholder="you@example.com"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="checkout-password">Password</Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96A3]" aria-hidden="true" />
            <Input
              id="checkout-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              className="h-11 rounded-xl bg-white pl-9"
              minLength={6}
              required
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-[#0E0E0C] text-white hover:bg-[#26303E] active:scale-[0.99]"
        >
          {isSubmitting ? "Opening checkout" : "Continue to secure payment"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      <p className="mt-4 text-center text-xs leading-5 text-[#697483]">
        Payment is handled by RevenueCat and Stripe. Pro unlocks in the app after you
        sign in with this account.
      </p>
        </>
      )}
    </div>
  )
}
