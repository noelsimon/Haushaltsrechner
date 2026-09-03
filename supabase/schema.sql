-- Haushaltsrechner: Tabellen + Row Level Security
--
-- Einmalig im Supabase-Projekt ausführen: Dashboard -> SQL Editor -> "New query"
-- -> diesen Inhalt einfügen -> Run.
--
-- Jede Zeile gehört einem Benutzer (user_id = auth.uid()). Die RLS-Policies
-- sorgen dafür, dass jeder Account ausschließlich seine eigenen Kategorien
-- und Buchungen lesen/schreiben kann – auch der öffentliche Publishable-Key
-- im Client erlaubt keinen Zugriff auf fremde Daten.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  group_name text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  description text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "categories_select_own" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;
drop policy if exists "categories_update_own" on public.categories;
drop policy if exists "categories_delete_own" on public.categories;

create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
drop policy if exists "transactions_insert_own" on public.transactions;
drop policy if exists "transactions_update_own" on public.transactions;
drop policy if exists "transactions_delete_own" on public.transactions;

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);
