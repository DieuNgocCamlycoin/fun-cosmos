# Visual story refinement — 2026-09-09

User correction: new Topic Worlds duplicated infographic prose in long card layouts. Restore artwork-led interaction; unify navigation and transitions; retain accepted Home/Urantia compositions and original source assets.

## Implemented
- Shared `SiteHeader` and `SiteFooter` on Home and all five Topic Worlds: six destinations, game link, 64px desktop / 60px mobile header. Home retains its topic dropdown. Scoped chrome overrides prevent legacy Home navigation colors leaking in.
- Shared light pearl/gold local navigation, consistent heading scale, shorter arrivals, removed broad rectangular hero-copy backgrounds. Contrast remains localized to copy.
- `/cosmos`: twelve sections consolidated into six. Pillars use the supplied world sprite; the eight-step garden story is selected manually. Adjacent Topic Worlds are destinations instead of repeated explanatory sections. Full original slide collections remain in an expandable, manually controlled archive.
- `/angel-ai`: introductory prose and role table consolidated into an artwork-led role selector. Existing dialogue demo and garden journey remain functional. Original gallery is expandable.
- `/love-score`: contributions and four-stage verification story are one selectable scene. `ArtworkFragment` uses non-destructive CSS windows/masks onto the two supplied infographics for contribution and journey imagery. No new raster asset is claimed. Illustrative history is explicitly labelled; no account data or scoring mechanism is fabricated. Definition/limits remain accessible in a disclosure; PLP artwork and source gallery retained.
- `/ecosystem`: existing upright/counterrotating logo system retained; chosen path highlights related logos. Directory and source artwork are disclosures rather than another open wall of logos/copy.
- `/your-turn`: replaces the generic star with supplied character artwork. Inspiration is a selectable scene; workshop visual reflects which of the seven fields have content. This is a progress illustration, not AI generation. Existing explicit local save/download behavior retained.
- Scene animations pause outside the viewport, honor global motion pause and reduced-motion settings. Native text, links and buttons remain available independently of decorative layers.

## Sources and limits
Original infographic files and character/background assets are preserved. CSS crops retain some original illumination around symbols; they are not newly generated transparent cutouts. No WebGL, video, new packages, production deployment, commit or push in this pass. Character motion is a gentle whole-layer float, not blinking or articulated wings. Cinematic-loop integration remains separate pending an approved clip.

## Verification
- `npx tsc --noEmit`: pass.
- `npm run lint`: zero errors, six existing Fast Refresh warnings.
- `npm run build`: pass.
- `git diff --check`: pass.
- Chrome/Playwright: six routes at desktop/mobile; shared header/footer; responsive overflow checks at 320/768/1024; scene selection and close/reopen; global pause; reduced motion; Love Score stage changes; draft save/reload; mobile menu and Escape. Tests use a separate browser context, not the user's saved draft.
- Preview on port 8084 (8083 already in use).
