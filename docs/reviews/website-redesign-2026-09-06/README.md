# TrackSpeed website and artwork — 6 September 2026

The public homepage has been rebuilt around original TrackSpeed product imagery, shorter copy, spacious sections and calm controls. All five public start methods remain explained. The complete feature guide covers 37 features, including clearly labeled development previews for landscape sprint/agility and Apple Watch.

The visual direction follows the two image-generated compositions in `design-v2-top.png` and `design-v2-stories.png`; the analysis and implementation choices are in `design-v2-analysis.md`. Full prompts and output provenance are in `imagegen-v2-plan.json`. Generation used the built-in image tool. The owner explicitly approved local background removal. All five final product PNGs in `public/product/` have verified alpha channels; only the exterior was removed and screens remain opaque. The indoor render used a magenta key.

Validation:
- Production build and TypeScript pass. The isolated commit candidate uses `npm run build -- --webpack`, because Turbopack rejects its shared dependency symlink outside the snapshot root. The main checkout's regular production build also passed before final styling adjustments.
- ESLint: zero errors; two existing admin navigation warnings remain outside this change.
- Browser verification covers desktop 1440 px, tablet 820 px, phones 390 and 320 px; Norwegian, German, Arabic, Japanese and Hindi layouts; tab keyboard navigation, three image settings, start accordions, mobile-menu Escape/focus restoration, and 37-feature guide navigation.
- No document overflow, missing visible images or browser runtime errors in the verified cases. Asset checks and browser results are preserved alongside this file.
- Development preview is local at http://localhost:3210/. No production deployment is included.

The iOS repository is separate. Its onboarding reuses the transparent timing, landscape and Watch artwork. Physical Watch installation and timing accuracy are separate from website imagery and build validation.
