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
```

Use the same `REVENUECAT_WEBHOOK_AUTH_KEY` value as the authorization key in the RevenueCat webhook configuration.

## RevenueCat Weekly Plan Configuration

The app expects weekly package identifiers in the default offering:

```text
weekly_default -> trackspeed_weekly ($4.99/week)
weekly_jumpersworld -> trackspeed_weekly_jumpersworld ($3.99/week)
```

Keep legacy monthly products available for existing subscribers, but remove monthly packages from the featured paywall once the weekly packages are live.

## RevenueCat Annual Plan Configuration

The app renders prices directly from StoreKit/RevenueCat. Keep the current offering mapped like this so the discounted annual price does not resolve to the full annual price:

```text
annual_default_full -> trackspeed_yearly ($59.99/year)
annual_default_discount -> trackspeed_yearly_discount ($49.99/year)
annual_jumpersworld_full -> trackspeed_yearly_jumpersworld ($59.99/year)
annual_jumpersworld_discount -> trackspeed_yearly_jumpersworld_discount ($49.99/year)
annual_discount -> trackspeed_yearly_discount ($49.99/year)
```

If the app shows `$59.99` for the discounted annual package, check the App Store Connect price for `trackspeed_yearly_discount` and the RevenueCat package mapping for `annual_default_discount` / `annual_jumpersworld_discount`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
