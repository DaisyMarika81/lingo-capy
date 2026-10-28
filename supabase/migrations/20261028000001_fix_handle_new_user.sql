-- Fix search_path and casting in handle_new_user trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  user_role_val public.user_role := 'student'::public.user_role;
  meta_role text;
begin
  meta_role := new.raw_user_meta_data->>'role';
  if meta_role in ('student', 'parent', 'teacher', 'admin') then
    user_role_val := meta_role::public.user_role;
  end if;

  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    user_role_val,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    role = excluded.role,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
exception
  when others then
    -- Log and allow auth user creation to proceed safely
    raise warning 'Error in handle_new_user: %', sqlerrm;
    return new;
end;
$$;
