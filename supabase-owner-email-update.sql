-- Run this only if you already ran supabase-schema.sql with the old email.
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

update public.profiles
set is_admin = email = 'effectgraphics90@gmail.com'
where email in ('habeeburahmanvtm6@gmail.com', 'habeebrahmanvtm6@gmail.com', 'effectgraphics9020@gmail.com', 'effectgraphics90@gmail.com');
