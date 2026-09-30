# Unified FUN COSMOS idea program rollout

The web code is additive, but the live Supabase project must receive the SQL below before submissions and community comments are enabled. Apply each file in the Supabase SQL Editor for project `mwtlzuhundbcpltzedin`, in order. Do not paste a service-role key into the browser or repository.

1. `supabase/migrations/20260928071000_idea_public_column_privacy.sql` — restrict direct public reads of private idea columns. Check whether this was already applied; do not run twice without reviewing existing grants.
2. `supabase/migrations/20260930090000_unified_idea_program.sql` — add the FUN.Rich post URL, replace the submission transaction, permit multiple ideas per wallet, and keep admin reward records in sync.
3. `supabase/migrations/20260930100000_idea_community.sql` — create moderated comments and likes.

The prerequisite `20260928070000_story_submission_transaction.sql` was already applied to this project. If that is not true in a different environment, apply it before step 2.

After applying, open `/your-turn`. The “hệ thống đang nâng cấp” notice should disappear. Test with a verified FUN COSMOS account: submit a story of at least 1,000 characters, both public post links, FUN.Rich profile and BNB Smart Chain wallet; confirm the receipt and record in `/y-tuong-cua-toi`; approve the idea in `/admin/fun-cosmos/ideas`; verify it appears on `/idea-hub`, and moderate a test comment. Approve a reward amount, export the FUN.Rich CSV, import it through FUN.Rich, then record the real transfer receipt. Exporting a file alone does not transfer CAMLY or mark an idea as rewarded.

Direct FUN.Rich account linking and automatic payouts are not enabled. These require a documented FUN.Rich authorization API and a transfer API with signed server-to-server credentials, receipt IDs, retry/idempotency behavior and reconciliation. The approved first release uses verified profile URL + wallet and admin-reviewed bulk import.
