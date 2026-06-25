This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## RevenueCat Webhook Environment

The production RevenueCat webhook endpoint is:

```text
https://mytrackspeed.com/api/webhooks/revenuecat
```

Set these environment variables anywhere the website is deployed:

```text
REVENUECAT_WEBHOOK_AUTH_KEY=...
REVENUECAT_SECRET_KEY=...
REVENUECAT_ENTITLEMENT_ID=Track Speed Pro
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
POSTHOG_API_KEY=...
POSTHOG_HOST=https://eu.i.posthog.com
```

Use the same `REVENUECAT_WEBHOOK_AUTH_KEY` value as the authorization key in the RevenueCat webhook configuration.
`POSTHOG_API_KEY` can be the same project key as `NEXT_PUBLIC_POSTHOG_KEY`; the webhook falls back to the public key if the server-only variable is absent.

## RevenueCat Web Checkout Environment

The web checkout page creates or verifies a Supabase auth user, sends that user to a RevenueCat Web Purchase Link backed by Stripe, and relies on the RevenueCat webhook above to unlock Pro in the same `subscriptions` table the app already reads.

Set these variables for web checkout:

```text
REVENUECAT_WEB_PURCHASE_LINK_ANNUAL=https://pay.rev.cat/...
REVENUECAT_WEB_PACKAGE_ID_ANNUAL=annual_default_full
REVENUECAT_WEB_PURCHASE_LINK_WEEKLY=https://pay.rev.cat/...
REVENUECAT_WEB_PACKAGE_ID_WEEKLY=weekly_default
```

If a RevenueCat Web Purchase Link supports an `{app_user_id}` placeholder, include it in the URL and the checkout API will replace it. Otherwise, the API appends `/<app_user_id>` to the link before redirecting.

Configure the Web Purchase Link success behavior in RevenueCat to redirect to `https://mytrackspeed.com/checkout/success`. The checkout API sends `skip_purchase_success=true`, so RevenueCat should send the customer directly to that configured success redirect after payment.

## RevenueCat Weekly Plan Configuration

The app expects weekly package identifiers in the default offering:

```text
weekly_default -> trackspeed_weekly ($7.99/week)
```

Keep legacy monthly products available for existing subscribers, but remove monthly packages from the featured paywall once the weekly packages are live.

## RevenueCat Annual Plan Configuration

The app renders prices directly from StoreKit/RevenueCat. Keep the current offering mapped like this:

```text
annual_default_full -> trackspeed_yearly ($59.99/year)
```

If the app shows the wrong annual price, check the App Store Connect price and the RevenueCat package mapping for `annual_default_full`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
