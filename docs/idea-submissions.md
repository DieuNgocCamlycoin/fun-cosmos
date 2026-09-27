# Idea submission setup

The Home and Your Turn editors share a seven-field draft in browser storage. English is the default; visitors can select Vietnamese from the shared header or footer. The draft stays on the device until a visitor submits it with a contact email and explicit consent.

`GET /api/public/ideas` reports whether the private ideas inbox is connected. The form disables sending and explains how to keep a draft when it is not. `POST /api/public/ideas` validates the payload, caps requests at 12 KB, checks the request origin, applies a honeypot, limits one email to five submissions in 24 hours, and returns a reference code. Submission records are private. The endpoint intentionally returns `503 {"code":"unavailable"}` until a D1 database is bound. Do not advertise submissions as live before provisioning the binding.

To enable delivery on Cloudflare:

1. Create a D1 database for ideas in the project's Cloudflare account. Apply `migrations/0001_ideas.sql` to that database.
2. Bind it to the FUN COSMOS Worker as `IDEAS_DB`. The current build generates `.output/server/wrangler.json`; configure the D1 binding in the deployment settings or in the final deployment configuration before publishing. Do not edit the generated file as the only source of configuration because builds replace it.
3. Set an internal review process for new rows. The `status` field starts at `new`; no public read endpoint exists. Limit database access to authorized team members. Decide retention and deletion procedures before accepting live submissions.
4. On a non-production environment, submit a test idea in EN and VI, record the returned `FC-...` reference, confirm both rows and the consent timestamp in D1, and test validation and rate limiting. Only then enable the public form in production.

The submission feature does not send email notifications or publish submitted ideas. It stores the contact email so the team can respond through its existing approved channel. Artwork remains in its original language; the English interface identifies that in the enlarged viewer.
