create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  username text not null,
  name text not null,
  role text not null check (role in ('siswa', 'guru', 'admin', 'kepsek', 'kurikulum')),
  "className" text not null default '',
  major text not null default '',
  subject text not null default ''
);

create unique index if not exists users_username_lower_idx
  on public.users (lower(username));

alter table public.users enable row level security;

create or replace function public.is_mls_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_mls_admin() from public;
grant execute on function public.is_mls_admin() to authenticated;

drop policy if exists "users_read_self_or_admin" on public.users;
create policy "users_read_self_or_admin" on public.users
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_mls_admin()));

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self" on public.users
  for insert to authenticated
  with check (id = (select auth.uid()) and role in ('siswa', 'guru'));

drop policy if exists "users_delete_admin" on public.users;
create policy "users_delete_admin" on public.users
  for delete to authenticated
  using ((select public.is_mls_admin()));

grant select, insert, delete on public.users to authenticated;

create or replace view public.user_directory with (security_invoker = false) as
  select id, name, role, "className", major, subject
  from public.users;

grant select on public.user_directory to authenticated;

create or replace function public.delete_auth_user_after_profile_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users where id = old.id;
  return old;
end;
$$;

drop trigger if exists users_delete_auth_account on public.users;
create trigger users_delete_auth_account
  after delete on public.users
  for each row execute function public.delete_auth_user_after_profile_delete();