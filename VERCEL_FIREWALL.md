# Vercel traffic protection

Last verified: 2026-07-16

The production Vercel project has the following edge protections enabled:

- Automatic Vercel DDoS mitigation.
- Bot Protection in `challenge` mode. Suspicious non-browser automation must pass a JavaScript challenge; Vercel-verified crawlers remain eligible for normal access.
- `Rate limit HTML page crawls`: `300` matching `GET` requests per `60s`, keyed by source IP. The rule applies when the `Accept` header contains `text/html` and denies requests above the limit.
- `Block common exploit scanners`: denies common WordPress, repository, environment-file, PHP-unit, and server-status probes before they reach Next.js.
- The AI Bots deny ruleset is intentionally not enabled, so identified AI crawlers can still discover public content.

These rules are attached to Vercel project `website` (`prj_GjAum9a0IVCIfQeqNLw7GBFRFdzc`) and take effect without a website redeploy.

## Inspect the active configuration

From the repository root:

```sh
npx vercel firewall rules list --cwd website
npx vercel firewall rules inspect "Rate limit HTML page crawls" --cwd website
npx vercel firewall rules inspect "Block common exploit scanners" --cwd website
```

Bot Protection is visible in the Vercel dashboard under **Firewall -> Rules -> Bot Management**.

## Emergency attack response

If Vercel shows an active attack or traffic is spiking unexpectedly, enable Attack Challenge Mode immediately:

```sh
npx vercel firewall attack-mode enable --cwd website
```

Disable it after the event is over:

```sh
npx vercel firewall attack-mode disable --cwd website
```

Attack Challenge Mode is deliberately not left on permanently because it challenges every unverified visitor, while the normal rules above target automated abuse continuously.
