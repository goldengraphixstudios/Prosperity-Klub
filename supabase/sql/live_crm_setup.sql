create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  name text not null,
  email text not null,
  phone text,
  location text,
  is_ofw boolean,
  income_range text,
  priorities jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  is_qualified boolean not null default false,
  source_page text,
  requested_resource text,
  recommended_follow_up text,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'contacted', 'qualified', 'archived')),
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_email_idx
  on public.leads (lower(email));

create index if not exists leads_source_page_idx
  on public.leads (source_page);

alter table public.leads enable row level security;

drop policy if exists "Authenticated can view leads" on public.leads;
create policy "Authenticated can view leads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

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

create table if not exists public.full_access_registrations (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  source_page text not null default '/membership',
  first_name text not null,
  middle_name text not null,
  last_name text not null,
  gender text not null,
  gender_other text,
  civil_status text not null,
  civil_status_other text,
  date_of_birth date not null,
  place_of_birth text not null,
  age integer not null check (age >= 0),
  weight text not null,
  height text not null,
  citizenship text not null,
  email text not null,
  mobile text,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'contacted', 'approved', 'archived')),
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists full_access_registrations_created_at_idx
  on public.full_access_registrations (created_at desc);

create index if not exists full_access_registrations_email_idx
  on public.full_access_registrations (lower(email));

alter table public.full_access_registrations enable row level security;

drop policy if exists "Authenticated can view full access registrations" on public.full_access_registrations;
create policy "Authenticated can view full access registrations"
on public.full_access_registrations
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update full access registrations" on public.full_access_registrations;
create policy "Authenticated can update full access registrations"
on public.full_access_registrations
for update
to authenticated
using (true)
with check (true);

create table if not exists public.ipon_challenge_registrations (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  source_page text not null default '/membership',
  first_name text not null,
  middle_name text not null,
  last_name text not null,
  gender text not null,
  gender_other text,
  civil_status text not null,
  civil_status_other text,
  date_of_birth date not null,
  place_of_birth text not null,
  age integer not null check (age >= 0),
  weight text not null,
  height text not null,
  citizenship text not null,
  email text not null,
  mobile text,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'contacted', 'approved', 'archived')),
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ipon_challenge_registrations_created_at_idx
  on public.ipon_challenge_registrations (created_at desc);

create index if not exists ipon_challenge_registrations_email_idx
  on public.ipon_challenge_registrations (lower(email));

alter table public.ipon_challenge_registrations enable row level security;

drop policy if exists "Authenticated can view ipon challenge registrations" on public.ipon_challenge_registrations;
create policy "Authenticated can view ipon challenge registrations"
on public.ipon_challenge_registrations
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update ipon challenge registrations" on public.ipon_challenge_registrations;
create policy "Authenticated can update ipon challenge registrations"
on public.ipon_challenge_registrations
for update
to authenticated
using (true)
with check (true);
