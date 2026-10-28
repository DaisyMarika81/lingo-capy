-- Migration: 20261028000000_init_schema_and_rls.sql
-- Description: Complete schema for Lingo Capy English Learning Web with RLS policies

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Enums
create type user_role as enum ('student', 'parent', 'teacher', 'admin');
create type content_status as enum ('draft', 'reviewed', 'published');

-- 2. Profiles Table (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text,
  avatar_url text,
  parent_id uuid references profiles(id) on delete set null,
  streak_days int not null default 0,
  last_active_at date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Books Table
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null default 'Lớp 6',
  cover_url text,
  description text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Units Table
create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  position int not null default 1,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

-- 5. Lessons Table
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  position int not null default 1,
  title text not null,
  video_id text,
  duration_sec int not null default 0,
  objectives jsonb default '[]'::jsonb,
  vocabulary jsonb default '[]'::jsonb,
  grammar jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 6. Exercises Table
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  position int not null default 1,
  title text not null,
  source text not null check (source in ('book', 'ai')) default 'book',
  created_at timestamptz not null default now()
);

-- 7. Questions Table
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  position int not null default 1,
  type text not null check (type in ('mcq', 'fill_blank', 'true_false', 'matching', 'reorder')),
  content jsonb not null,
  answer jsonb not null,
  explanation text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- 8. Enrollments Table
create table if not exists enrollments (
  user_id uuid not null references profiles(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  expires_at timestamptz,
  primary key (user_id, book_id)
);

-- 9. Lesson Progress Table
create table if not exists lesson_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  watched_pct numeric not null default 0 check (watched_pct >= 0 and watched_pct <= 100),
  last_position_sec int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- 10. Attempts Table
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  score numeric default 0 check (score >= 0 and score <= 100),
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

-- 11. Attempt Answers Table
create table if not exists attempt_answers (
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  user_answer jsonb not null,
  is_correct boolean not null,
  primary key (attempt_id, question_id)
);

-- ====================================================================
-- TRIGGERS & FUNCTIONS
-- ====================================================================

-- Trigger: Automatically create Profile on Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role_val user_role := 'student';
begin
  if new.raw_user_meta_data->>'role' in ('student', 'parent', 'teacher', 'admin') then
    user_role_val := (new.raw_user_meta_data->>'role')::user_role;
  end if;

  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    user_role_val,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper function: Check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Helper function: Check if current user is teacher or admin
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'teacher')
  );
$$ language sql security definer stable;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table profiles enable row level security;
alter table books enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table exercises enable row level security;
alter table questions enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;

-- PROFILES POLICIES
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Parents can read child profiles"
  on profiles for select
  using (parent_id = auth.uid());

create policy "Staff can read all profiles"
  on profiles for select
  using (public.is_staff());

create policy "Users can update own non-role profile data"
  on profiles for update
  using (auth.uid() = id);

create policy "Admin full access to profiles"
  on profiles for all
  using (public.is_admin());

-- BOOKS POLICIES
create policy "Staff manage books"
  on books for all
  using (public.is_staff());

create policy "Enrolled students and parents read published books"
  on books for select
  using (
    status = 'published' and (
      exists (
        select 1 from enrollments
        where enrollments.book_id = books.id and enrollments.user_id = auth.uid()
      ) or exists (
        select 1 from enrollments e
        join profiles p on p.id = e.user_id
        where e.book_id = books.id and p.parent_id = auth.uid()
      )
    )
  );

-- UNITS POLICIES
create policy "Staff manage units"
  on units for all
  using (public.is_staff());

create policy "Read units of accessible books"
  on units for select
  using (
    exists (
      select 1 from books
      where books.id = units.book_id and (
        books.status = 'published' and (
          exists (select 1 from enrollments where enrollments.book_id = books.id and enrollments.user_id = auth.uid())
          or public.is_staff()
        )
      )
    )
  );

-- LESSONS POLICIES
create policy "Staff manage lessons"
  on lessons for all
  using (public.is_staff());

create policy "Read lessons of accessible units"
  on lessons for select
  using (
    exists (
      select 1 from units
      join books on books.id = units.book_id
      where units.id = lessons.unit_id and books.status = 'published' and (
        exists (select 1 from enrollments where enrollments.book_id = books.id and enrollments.user_id = auth.uid())
        or public.is_staff()
      )
    )
  );

-- EXERCISES POLICIES
create policy "Staff manage exercises"
  on exercises for all
  using (public.is_staff());

create policy "Read exercises of accessible lessons"
  on exercises for select
  using (
    exists (
      select 1 from lessons
      join units on units.id = lessons.unit_id
      join books on books.id = units.book_id
      where lessons.id = exercises.lesson_id and books.status = 'published' and (
        exists (select 1 from enrollments where enrollments.book_id = books.id and enrollments.user_id = auth.uid())
        or public.is_staff()
      )
    )
  );

-- QUESTIONS POLICIES
create policy "Staff manage questions"
  on questions for all
  using (public.is_staff());

create policy "Students can view questions for exercises"
  on questions for select
  using (
    status = 'published' and exists (
      select 1 from exercises
      join lessons on lessons.id = exercises.lesson_id
      join units on units.id = lessons.unit_id
      join books on books.id = units.book_id
      where exercises.id = questions.exercise_id and books.status = 'published' and (
        exists (select 1 from enrollments where enrollments.book_id = books.id and enrollments.user_id = auth.uid())
      )
    )
  );

-- ENROLLMENTS POLICIES
create policy "Staff manage enrollments"
  on enrollments for all
  using (public.is_staff());

create policy "Users read own enrollments"
  on enrollments for select
  using (
    user_id = auth.uid() or exists (
      select 1 from profiles where profiles.id = enrollments.user_id and profiles.parent_id = auth.uid()
    )
  );

-- LESSON PROGRESS POLICIES
create policy "Users manage own progress"
  on lesson_progress for all
  using (user_id = auth.uid());

create policy "Parents read child progress"
  on lesson_progress for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = lesson_progress.user_id and profiles.parent_id = auth.uid()
    )
  );

create policy "Staff read all progress"
  on lesson_progress for select
  using (public.is_staff());

-- ATTEMPTS POLICIES
create policy "Users manage own attempts"
  on attempts for all
  using (user_id = auth.uid());

create policy "Parents read child attempts"
  on attempts for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = attempts.user_id and profiles.parent_id = auth.uid()
    )
  );

create policy "Staff read all attempts"
  on attempts for select
  using (public.is_staff());

-- ATTEMPT ANSWERS POLICIES
create policy "Users insert and read own attempt answers"
  on attempt_answers for all
  using (
    exists (
      select 1 from attempts
      where attempts.id = attempt_answers.attempt_id and attempts.user_id = auth.uid()
    )
  );

create policy "Parents read child attempt answers"
  on attempt_answers for select
  using (
    exists (
      select 1 from attempts
      join profiles on profiles.id = attempts.user_id
      where attempts.id = attempt_answers.attempt_id and profiles.parent_id = auth.uid()
    )
  );

create policy "Staff read all attempt answers"
  on attempt_answers for select
  using (public.is_staff());
