# Verification email follow-up — 2026-09-28

The resend hook previously ignored Supabase response errors and claimed successful delivery even on failure. It now checks `error`, reports rate limits, and keeps account existence private. Signup copy no longer promises that an email was delivered.

Actual delivery remains unverified. Check the external project Authentication logs and SMTP configuration. The built-in Supabase email service restricts recipients to project-team addresses and allows only two emails per hour. Configure custom SMTP for general registration; verify the sender domain and allowed redirect URLs for production, Lovable Preview and local development. Do not disable email verification as a workaround.

Official references:
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/rate-limits

UI validation: original Father source and web asset have identical SHA-256; no generated anatomy. Browser checks at 1440, 1177, 390 and 320 px found no horizontal overflow. All seven workshop tabs select correctly. No email was sent during these checks; authenticated submission remains for the user's test.
