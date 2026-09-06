# Compact setup section — 7 September 2026

The setup section formerly separated its title and introduction across the page, then vertically centered a short explanation beside a fixed 510 px image block. This left a 175 px gap below the tabs at a 1440 px viewport.

The title, introduction, tabs and selected explanation now form one column, with the same phone images alongside. Image height follows its content, the section padding is smaller, and the course diagram sits closer to the description. Images scale within the available width on small screens. The three setup steps remain immediately below both columns; their accessible label follows the selected mode.

At 1440 px, the Connected Gates section shrank from **1057.8 px to 694.5 px** (34.35%). The tab-to-explanation gap is **28 px**, down from 175.36 px. See `baseline.json`, `comparison.json` and the before/after screenshots. No copy or product capability changed.

Validation:

- `npx eslint src/components/marketing/MarketingHome.tsx src/components/marketing/ModeExplorer.tsx` passed.
- `npm run build` passed; full output retained locally in `build.log`.
- `node docs/reviews/setup-spacing-2026-09-07/verify.mjs` passed **16 mode/viewport checks**: both Connected Gates and Solo Laps at English widths 1440, 1024, 820, 390 and 320; Arabic 390 and 1440; German 1440. Images decoded, all three steps remained, no page/section overflow or JavaScript errors occurred, selected panel labels matched, and keyboard Home/arrow switching worked in LTR and RTL.
- Desktop, English mobile and Arabic desktop screenshots were visually inspected.
- Initial automation clicked before page load/hydration finished and sampled the old selection. The verifier now waits for load and the selected tab state; a separate loaded-page interaction check passed without console or page errors. No product-state workaround was added.
- `git diff --check` passed.

The localhost preview remains available at `http://localhost:3210/#how-it-works`. This change is local and committed in the nested website repository; it has not been deployed. Existing locale/SEO/legal edits remain outside this change. No iOS or Watch source was changed.
