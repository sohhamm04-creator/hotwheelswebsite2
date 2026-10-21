-- Run this SQL in your Supabase project: SQL Editor -> New query -> Run.
create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  delivery_address text not null,
  items jsonb not null,
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','fulfilled')),
  created_at timestamptz not null default now()
);

-- API writes use the server-side service-role key, which must only be stored in Vercel
-- environment variables. Do not put it in browser JavaScript or commit it to GitHub.
alter table public.newsletter_subscribers enable row level security;
alter table public.orders enable row level security;
