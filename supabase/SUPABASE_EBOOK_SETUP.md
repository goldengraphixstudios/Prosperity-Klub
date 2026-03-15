# Supabase Ebook Setup

## What is already wired in the site

- The ebook request form now writes to Supabase directly when these public env vars exist:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- On GitHub Pages, the build workflow maps your existing repository secrets:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

## Step 1. Run the SQL

Open the Supabase SQL Editor and run:

- [supabase/sql/ebook_requests.sql](./sql/ebook_requests.sql)

That creates the `ebook_requests` table and allows anonymous inserts from the public website.

## Step 2. Upload the ebook file

In Supabase Storage:

1. Open bucket: `Storage`
2. Create folder: `ebooks`
3. Upload the PDF as:

```text
ebooks/the-secret-to-saving-and-building-your-future.pdf
```

## Step 3. Decide how you want delivery to work

### Option A. Fast demo setup

Use Supabase only for lead capture.

- The website stores each ebook request in `ebook_requests`
- You manually send the ebook from your side for now

This is the fastest option and already works with the current code once the SQL is in place.

### Option B. Proper automatic email delivery

This needs one more backend layer because:

- GitHub Pages is static
- The anon key is public
- You should not generate private ebook delivery from the browser if you want proper control

Recommended approach:

1. Add a Supabase Edge Function
2. Add these function secrets inside Supabase:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` or another email provider key
   - `RESEND_FROM_EMAIL`
3. The function should:
   - insert the lead into `ebook_requests`
   - generate a signed URL for the ebook in bucket `Storage`
   - email that signed URL to the user
   - update `status` to `sent`

## Minimal data flow

```text
Website form -> Supabase table (ebook_requests) -> manual send now
Website form -> Edge Function -> signed URL + email -> automatic send later
```

## Important note

Your current GitHub Actions secrets are fine for the public website build because the anon key is safe for client use.

Do not put the `service_role` key into GitHub Pages client code.
