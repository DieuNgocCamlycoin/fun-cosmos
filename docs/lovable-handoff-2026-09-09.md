# Lovable handoff — 2026-09-09

## Baseline

Fast-forwarded clean main from 6f6d894 to 900951d81309e46f2088ced226da36748f28792d (20 Lovable commits). No rewritten history, rollback, production deployment or push of this refinement.

Latest source includes /angel-ai, /love-score, shared TopicWorldShell/WorldSection/DeepDiveGallery and GAME_URL pointing to https://funkingdom.itch.io/funcosmos10d. Auth stays with the game. Home teasers are preserved.

## Focused changes

- Love Score: viewport-aware desktop hero, bright original portal, localized text contrast, existing cast-gold title treatment, bounded character sizes and mobile reflow. Reduced supporting spacing; corrected journey connector to icon centers. Contributions and journey selections are manual so selection is not overwritten while reading or pausing motion. Preserved nine sections and copy.
- Added /cosmos per the handoff: twelve narrative sections, reusing existing pillars, loop, Anna story and infographic topic groups. Added link in Home dropdown and shared topic navigation. Original Home sections remain.
- Love Score assets used Lovable-only relative /__l5e URLs which failed locally. Exact copies are in public/cosmos/love-score, fetched from https://id-preview--ecd018db-70ec-47e9-8f69-294999bcd2ba.lovable.app plus the paths in the original src/assets/*.asset.json pointers. Pointers remain intact. No artwork edited or identity substituted. WebP copies use their actual content-type extension; father PNG retains alpha.

## Validation

- npx tsc --noEmit: pass.
- npm run lint: 0 errors; six existing react-refresh warnings in badge/button/form/navigation-menu/sidebar/toggle.
- npm run build: pass.
- git diff --check: pass.
- Playwright Chrome: Love Score and Cosmos at 1440, 1280, 768, 390, 320px, no horizontal overflow. Visually reviewed desktop and mobile screenshots.
- Contributions, manual journey selection, viewer zoom/Escape/focus restoration, five pillars, core loop, Anna selection, all nine archive groups, motion pause and Home/Angel route loading: pass, no page exceptions.
- Local preview: http://127.0.0.1:8083 (not a public deployment).
