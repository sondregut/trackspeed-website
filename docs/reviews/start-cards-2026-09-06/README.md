# Start-method artwork and page order — 6 September 2026

The landscape sprint demonstration now follows the hero. Five original athlete illustrations replace the start-method accordion, retaining the localized timing descriptions. Three cards occupy the first desktop row; two wider cards finish the group. On phones all five stack vertically. The illustrations and cue chips are decorative; headings and descriptions remain accessible HTML. Motion is static.

`manifest.json` records the exact built-in image generation prompts, source files, final asset paths, hashes, alpha checks, and owner approval for local background removal. Flying, countdown, and in-frame preserve generated alpha. Touch and voice use local magenta removal. All five have corresponding native app assets.

Validation passed:

- `npx eslint src/components/marketing/MarketingHome.tsx`
- `npm run build` (`build.log`, retained locally)
- `node docs/reviews/start-cards-2026-09-06/verify.mjs`
- English at 1440, 820, 390 and 320 pixels; Arabic at 390; German at 1440. All five assets decode, page/card widths fit, landscape is second, and no page errors occur. See `verification.json` and the local screenshots.
- `git diff --check`

This is a local website change. No deployment was requested or performed. Existing unrelated locale/SEO/legal changes are outside this commit.
