create extension if not exists pgcrypto;

create table if not exists public.membership_registrations (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  membership_path text not null
    check (membership_path in ('full_access', 'ipon_challenge')),
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

create index if not exists membership_registrations_created_at_idx
  on public.membership_registrations (created_at desc);

create index if not exists membership_registrations_email_idx
  on public.membership_registrations (lower(email));

create index if not exists membership_registrations_path_idx
  on public.membership_registrations (membership_path);

alter table public.membership_registrations enable row level security;

drop policy if exists "Anon can insert membership registrations" on public.membership_registrations;
create policy "Anon can insert membership registrations"
on public.membership_registrations
for insert
to anon
with check (membership_path = 'full_access');

drop policy if exists "Authenticated can view membership registrations" on public.membership_registrations;
create policy "Authenticated can view membership registrations"
on public.membership_registrations
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update membership registrations" on public.membership_registrations;
create policy "Authenticated can update membership registrations"
on public.membership_registrations
for update
to authenticated
using (true)
with check (true);
