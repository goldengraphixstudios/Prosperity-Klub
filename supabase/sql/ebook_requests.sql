create extension if not exists pgcrypto;

create table if not exists public.ebook_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  source_page text not null default '/resources',
  requested_resource text not null default 'The Secret to Saving and Building Your Future',
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'manual')),
  delivery_method text not null default 'email',
  sent_at timestamptz,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ebook_requests_created_at_idx
  on public.ebook_requests (created_at desc);

create index if not exists ebook_requests_email_idx
  on public.ebook_requests (lower(email));

alter table public.ebook_requests enable row level security;

drop policy if exists "Anon can insert ebook requests" on public.ebook_requests;
create policy "Anon can insert ebook requests"
on public.ebook_requests
for insert
to anon
with check (true);

drop policy if exists "Authenticated can view ebook requests" on public.ebook_requests;
create policy "Authenticated can view ebook requests"
on public.ebook_requests
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update ebook requests" on public.ebook_requests;
create policy "Authenticated can update ebook requests"
on public.ebook_requests
for update
to authenticated
using (true)
with check (true);
