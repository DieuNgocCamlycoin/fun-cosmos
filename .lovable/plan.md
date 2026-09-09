# FUN COSMOS Home — Cinematic Consolidation

## Quick inspection report

1. **Sections consolidated into one Story Gallery** — the nine FUN COSMOS blocks currently listed in `src/components/cosmos-contents.ts` (FUN COSMOS là gì, Không chỉ là một trò chơi, Người chơi có thể làm gì, Game–Real Life/Anna, Core Idea, Core Loop, Năm trụ cột, O2O, FUN COSMOS thu hút vì điều gì) plus the "Hành trình trở về" intro artwork. Today each renders as its own full section; all artwork is kept, none is rewritten into cards.
2. **Reusable components** — the existing `TopicGallery` (autoplay, progress line, thumbnails, swipe, pause) and `ArtworkViewer` (full-image zoom) already do everything needed. The new gallery is built on the same pieces, extended to carry chapter titles per item, not a new viewer.
3. **Video** — `Fun_Cosmos_HERO_202609091213.mp4` is used for the FUN COSMOS cinematic section. A second file `VD.mp4` was also supplied; it is not used unless you say where it belongs.
4. **Game covers** — Kingdom Hotel and FUN CITY & BEACH covers supplied. No Camly Coin Adventure cover arrived in this batch, so the existing approved Camly artwork already in the project (the 99.999 Happy Camly Coin scene) is used as its cover. Send the real cover and it is swapped in.
5. **Game links** — Kingdom Hotel: funkingdom.itch.io/funcosmos10d · City & Beach: funkingdom.itch.io/funcosmos5d · Camly/Treasure City: fun-cosmos.pages.dev. No invented links.
6. **Untouched** — opening hero, Urantia scene and gallery, header hide-on-scroll behaviour, Angel AI, Love Score, FUN Ecosystem, Your Turn, all other routes.

## New Home rhythm

```text
01 Opening hero        (unchanged)
02 Urantia             (unchanged)
03 FUN COSMOS cinematic video stage   (new)
04 Discover FUN COSMOS — one story gallery   (replaces 9 stacked sections)
05 Choose your world — 3 game covers  (new, replaces current text-only "games" block)
06 Angel AI · 07 Love Score · 08 Ecosystem · 09 Your Turn  (unchanged)
10 Final portal CTA    (existing direction)
```

## 03 — Cinematic video stage

Centered stage, ~90vw wide and ~66vh tall on desktop, cosmic breathing space around it, gold hairline frame and soft outer glow. Video autoplays muted, loops, plays inline, no native controls, `object-fit: cover` with tuned focus point per breakpoint. Small elegant sound toggle in a corner (HTML, keyboard reachable). Reduced motion or no-autoplay: a still frame from the video is shown instead.

Overlay text in HTML over the video, using the existing gold title treatment:
eyebrow `5D NEW EARTH ROLE-PLAYING GAME`, title `CHƠI VŨ TRỤ. / SỐNG THIÊN ĐÀNG.`, one supporting line, primary `KHÁM PHÁ FUN COSMOS` → `/cosmos`, secondary `CHƠI NGAY` → existing game entry behaviour.

## 04 — Discover FUN COSMOS story gallery

One dominant canvas: large active infographic, thumbnail strip, position indicator, prev/next, gold progress line, slow luminous cross-fade with a slight recede/blur on the outgoing image. Autoplay continues as today and suspends after direct interaction; pause control kept. Beside the artwork: the chapter headline plus one short sentence only — no re-typed infographic content. Click the artwork to open the existing full-image zoom viewer. Keyboard arrows, mobile swipe.

## 05 — Choose your world

Heading `CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO`, one supporting line. Desktop: three covers in one equal row, artwork dominant, no white cards. Hover/focus lifts the chosen portal slightly, adds a luminous rim and glow, softly recedes the other two, and strengthens its description and CTA.

- Kingdom Hotel — Bé Trí — tour and explore the dream hotel world — `BƯỚC VÀO KINGDOM HOTEL`
- FUN City & Beach — Bé Trí — change outfits, unlimited fashion, explore city and beach — `KHÁM PHÁ CITY & BEACH`
- Camly Coin Adventure — Bé Hoàng — explore the city and collect Camly Coin — `BẮT ĐẦU CAMLY COIN ADVENTURE`

Each CTA opens the real game URL in a new tab. No login, no account handling on the website — the games keep their own.

Mobile: one cover at a time with horizontal snap-swipe, the next cover peeking, dots, and a large CTA.

## Technical notes

- New files: `src/components/cosmos-cinema.tsx` + css (video stage), `src/components/cosmos-story-gallery.tsx` + css (built on `TopicGallery`/`ArtworkViewer`), `src/components/game-worlds.tsx` + css.
- `src/routes/index.tsx`: remove the nine `cosmosContents` sections and the current `#games` text block; insert sections 03–05. Chapter/nav anchors `about` and `games` are preserved so the header menu keeps working.
- Video, logo and the two supplied covers go through `lovable-assets` CDN pointers, not into the repo.
- CSS-only motion (transforms/opacity), no Three.js/GSAP, reduced-motion honoured, lazy loading for offscreen artwork.
