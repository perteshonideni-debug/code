-- ==============================================================================
-- CodePath PostgreSQL Database Schema & Supabase Migrations
-- Phase 5: Scalable schema for courses, progress, workshops, and achievements
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with educational profile, XP, streak, and role
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  xp integer not null default 0,
  streak_days integer not null default 0,
  last_activity_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. COURSES
create table if not exists public.courses (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  level text not null default 'Beginner',
  duration text not null,
  accent text not null default 'PY',
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MODULES
create table if not exists public.modules (
  id text primary key,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CHAPTERS
create table if not exists public.chapters (
  id text primary key,
  module_id text references public.modules(id) on delete cascade not null,
  title text not null,
  sort_order integer not null default 0,
  prerequisite_chapter_id text,
  learning_version integer not null default 2,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. LESSONS
create table if not exists public.lessons (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  title text not null,
  duration text not null default '10 min',
  lede text,
  content jsonb not null default '[]'::jsonb,
  objectives jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. WORKSHOPS
create table if not exists public.workshops (
  id text primary key,
  chapter_id text references public.chapters(id) on delete set null,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. WORKSHOP STEPS
create table if not exists public.workshop_steps (
  id text primary key,
  workshop_id text references public.workshops(id) on delete cascade not null,
  step_number integer not null,
  title text not null,
  instructions text not null,
  explanation text not null,
  starter_code text not null default '',
  expected_behavior text,
  test_definitions jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CHALLENGES / EXERCISES
create table if not exists public.challenges (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  title text not null,
  description text not null,
  level_id text not null,
  starter_code text not null,
  hints jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. CHALLENGE TESTS
create table if not exists public.challenge_tests (
  id uuid default uuid_generate_v4() primary key,
  challenge_id text references public.challenges(id) on delete cascade not null,
  label text not null,
  test_assertion text not null,
  sort_order integer not null default 0
);

-- 10. ENROLLMENTS
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  unique (user_id, course_id)
);

-- 11. LESSON PROGRESS
create table if not exists public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text references public.lessons(id) on delete cascade not null,
  is_completed boolean not null default false,
  comprehension_passed boolean not null default false,
  example_completed boolean not null default false,
  exercise_passed boolean not null default false,
  review_passed boolean not null default false,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, lesson_id)
);

-- 12. WORKSHOP PROGRESS
create table if not exists public.workshop_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  workshop_id text references public.workshops(id) on delete cascade not null,
  current_step integer not null default 0,
  completed_steps jsonb not null default '[]'::jsonb,
  attempts jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, workshop_id)
);

-- 13. STEP SUBMISSIONS
create table if not exists public.step_submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  step_id text not null,
  code text not null,
  passed boolean not null default false,
  error_message text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. ACHIEVEMENTS CATALOG
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  category text not null default 'learning',
  xp_reward integer not null default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. USER ACHIEVEMENTS
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text references public.achievements(id) on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, achievement_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_steps enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_tests enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.workshop_progress enable row level security;
alter table public.step_submissions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- Public content read policies
create policy "Courses are readable by everyone" on public.courses for select using (is_published = true);
create policy "Modules are readable by everyone" on public.modules for select using (true);
create policy "Chapters are readable by everyone" on public.chapters for select using (true);
create policy "Lessons are readable by everyone" on public.lessons for select using (true);
create policy "Workshops are readable by everyone" on public.workshops for select using (true);
create policy "Workshop steps are readable by everyone" on public.workshop_steps for select using (true);
create policy "Challenges are readable by everyone" on public.challenges for select using (true);
create policy "Challenge tests are readable by everyone" on public.challenge_tests for select using (true);
create policy "Achievements are readable by everyone" on public.achievements for select using (true);

-- User-specific data policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own enrollments" on public.enrollments for all using (auth.uid() = user_id);
create policy "Users can manage own lesson progress" on public.lesson_progress for all using (auth.uid() = user_id);
create policy "Users can manage own workshop progress" on public.workshop_progress for all using (auth.uid() = user_id);
create policy "Users can manage own step submissions" on public.step_submissions for all using (auth.uid() = user_id);
create policy "Users can view own achievements" on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

-- Admin policies
create policy "Admins can manage courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage lessons" on public.lessons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage workshop steps" on public.workshop_steps for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- SEED STANDARD ACHIEVEMENTS
-- ==============================================================================

insert into public.achievements (id, title, description, icon, category, xp_reward) values
  ('first_steps', 'Hapat e Parë', 'Përfundo mësimin e parë në CodePath.', '🚀', 'learning', 50),
  ('curious_mind', 'Mendje Kurioze', 'Përfundo 5 mësime të plota.', '💡', 'learning', 100),
  ('code_runner', 'Ekzekutuesi i Kodit', 'Ekzekuto 10 herë kod Python në shfletues.', '⚡', 'practice', 50),
  ('quiz_ace', 'Mjeshtër i Kuizeve', 'Kalo një kuiz me 100% të sakta.', '🎯', 'assessment', 75),
  ('email_architect', 'Arkitekt i Programeve', 'Përfundo të gjithë hapat e Workshop-it Email Simulator.', '📧', 'workshop', 200),
  ('streak_3', 'Momentum i Pandërprerë', 'Mëso për 3 ditë radhazi pa ndërprerje.', '🔥', 'streak', 100),
  ('streak_7', 'Përkushtim i Plotë', 'Mëso për 7 ditë radhazi në platformë.', '🏆', 'streak', 250),
  ('chapter_champion', 'Kampion i Kapitullit', 'Kalo provimin e parë të plotë të një kapitulli.', '🥇', 'assessment', 150),
  ('python_graduate', 'Diplomant i Python-it', 'Përfundo të 7 kapitujt dhe të gjitha kërkesat e kursit.', '🎓', 'mastery', 500)
on conflict (id) do nothing;
