-- profiles: one row per auth user, stores @handle
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null,
  display_name text,
  created_at timestamptz not null default now(),
  constraint profiles_handle_format check (handle ~ '^[a-z0-9_]{3,30}$'),
  constraint profiles_handle_lowercase check (handle = lower(handle))
);

create unique index profiles_handle_key on public.profiles (handle);

-- bookmarks
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  url text not null check (url ~ '^https?://'),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookmarks_user_id_idx on public.bookmarks (user_id);
create index bookmarks_public_idx on public.bookmarks (user_id) where is_public = true;

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookmarks_set_updated_at
  before update on public.bookmarks
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;

-- PROFILES
create policy "profiles_select_public"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- BOOKMARKS
create policy "bookmarks_select_own"
  on public.bookmarks for select
  to authenticated
  using (auth.uid() = user_id);

create policy "bookmarks_select_public"
  on public.bookmarks for select
  to anon, authenticated
  using (is_public = true);

create policy "bookmarks_insert_own"
  on public.bookmarks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "bookmarks_update_own"
  on public.bookmarks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "bookmarks_delete_own"
  on public.bookmarks for delete
  to authenticated
  using (auth.uid() = user_id);
