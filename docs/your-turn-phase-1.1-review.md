# Your Turn Phase 1.1 — review and preview readiness

## Source and assessment

The two user-supplied Lovable plans are archived in `docs/plans/`. They are reference specifications, not instructions to publish or overwrite other pages. The user requests analysis and completion of the existing program.

The story-led flow is appropriate: short seeds → story → Facebook sharing → review → submission → moderation → Idea Hub. The existing `/tao-y-tuong` already implements most of the intended UI, copy prompt, 1,000–30,000 story limits, opt-in link consent, review and congratulations. Admin and public detail already display stories and tolerate missing legacy stories. These components are reused.

## Changes in this review

- Archive three supplied original Father images, with hashes, under `assets/source/father/`; do not replace approved hero artwork automatically.
- Connect `/your-turn` to the existing authenticated creator rather than the separate anonymous inbox.
- Import the seven local sketch answers only when there is no creator draft to recover; preserve the original sketch cache.
- Wait for cache recovery before writing the initial empty draft. Storage failures after a successful server save no longer falsely report a failed save.
- Add direct navigation across seed, story, Facebook, verification and review steps. Keep short answers and optional seed 07.
- Lock final submission synchronously before the first asynchronous save to prevent rapid duplicate clicks.
- Validate Facebook URLs with a URL parser, HTTPS, exact allowed hostnames, no credentials or alternate port. This verifies URL shape, not whether the post is public or contains the hashtags; that remains an admin check.
- Stop treating failed private-details or tag writes as successful draft saves.
- Use explicit server-side column selections for public ideas and strip Facebook links unless the creator has opted in.
- Replace separate final writes with a server-only transactional RPC. If the RPC is missing, final submission fails clearly and the saved draft remains available.

## Database verification and pending SQL

Read-only REST probes (`limit=0`, no idea contents retrieved) returned HTTP 200 for `story,facebook_post_url,facebook_post_public_consent`. No duplicate column migration is needed.

A second probe returned HTTP 200 for `admin_note,reward_tx_hash,creator_user_id` using the public key. Existing API filtering is not sufficient to protect raw REST queries. This confirms column permissions, not that any private row was downloaded.

Prepared, **not applied**:

1. `20260928070000_story_submission_transaction.sql`: row lock, retry handling, validation, rate limit, duplicate signals, participation/reward creation and audit in one transaction. Existing revisions reuse the participation/reward records. Only service_role may execute it. No new story columns or rewritten old rows.
2. `20260928071000_idea_public_column_privacy.sql`: narrow direct SELECT grants to content columns. RLS policies remain unchanged. Private Facebook post links and internal fields are served only by authorized server functions.

The second script changes SELECT grants; it must be coordinated with the updated server code and reviewed against any other consumers that read `ideas` directly. Neither script has been executed or tested against the remote database. Review both before applying. The previous standalone `your_turn_inbox` migration is not the backend for this authenticated Phase 1.1 flow.

The current local environment contains public Supabase settings but **no server service-role credential**. Configure `FUN_COSMOS_SERVICE_ROLE_KEY` in server-only environment/Lovable Secrets (Lovable reserves custom names beginning with `SUPABASE_`). The server also accepts the legacy `SUPABASE_SERVICE_ROLE_KEY` for existing deployments. Never put either key in a `VITE_` variable or send it through chat. Without this configuration, authenticated saves, admin operations and the safe server public reads cannot be verified end-to-end locally.

## Validation

- Targeted ESLint passed for edited creator, Your Turn, content helper, server functions and submission form.
- Unit checks passed: exact Facebook hosts/credentials/protocol, prompt includes seed contents, share hashtags, empty legacy-story excerpt.
- Production bundle build passed after the final transaction wiring.
- TypeScript has pre-existing missing `SiteFooter` props in creator, hub and account routes. New errors introduced in this work were corrected; the existing footer errors still prevent a clean full type check.
- No remote database migration, production deployment or linked-branch push performed in this review.

## Remaining acceptance work

After server configuration and migrations: verify draft 500 characters, final story thresholds 999/1,000/30,000/30,001, missing/invalid Facebook URLs, checkbox consent false/true, actual clipboard behavior, retry/double-click and transaction rollback, private data via raw REST, legacy ideas, admin publish and reward workflow. Test authenticated layouts at 1440, 1177, tablet, 390 and 320 pixels. Do not report these as passed until exercised.

The creator body is currently primarily Vietnamese even when the shared header is English. Complete its English copy before accepting the earlier site-wide English-default requirement. Privacy and transaction integration take priority before production publication.
