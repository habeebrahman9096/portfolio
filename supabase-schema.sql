-- Run this once in Supabase Dashboard > SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, new.email = 'effectgraphics90@gmail.com');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

alter table public.profiles enable row level security;

insert into public.profiles (id, email, is_admin)
select id, email, email = 'effectgraphics90@gmail.com'
from auth.users
where email = 'effectgraphics90@gmail.com'
on conflict (id) do update set is_admin = excluded.is_admin;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 80),
  category text not null check (category in ('branding', 'logo', 'poster', 'social', 'print', 'thumbnail')),
  category_label text not null,
  image_url text not null,
  description text not null check (char_length(description) <= 600),
  client text not null default 'Independent project',
  year text not null,
  role text not null,
  tools text[] not null default '{}',
  caption text not null default '',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
create policy "Public can view projects" on public.projects for select using (true);
create policy "Only admin can add projects" on public.projects for insert with check (public.is_admin());
create policy "Only admin can edit projects" on public.projects for update using (public.is_admin()) with check (public.is_admin());
create policy "Only admin can delete projects" on public.projects for delete using (public.is_admin());

insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

create policy "Public can view project images" on storage.objects for select using (bucket_id = 'project-images');
create policy "Only admin can upload project images" on storage.objects for insert with check (bucket_id = 'project-images' and public.is_admin());
create policy "Only admin can update project images" on storage.objects for update using (bucket_id = 'project-images' and public.is_admin());
create policy "Only admin can delete project images" on storage.objects for delete using (bucket_id = 'project-images' and public.is_admin());
