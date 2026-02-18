-- PathForge AI Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('student', 'admin', 'counselor');
create type task_type as enum ('exploration', 'creative', 'reflection', 'hands-on', 'learning');
create type interest_category as enum ('science', 'art', 'sports', 'music', 'reading', 'tech', 'nature', 'building', 'social', 'other');
create type strength_dimension as enum ('cognitive', 'emotional', 'social', 'creative', 'practical');
create type assessment_type as enum ('onboarding', 'periodic', 'special');
create type assessment_source as enum ('self', 'parent', 'teacher', 'ai');
create type goal_type as enum ('dream', 'skill', 'short_term', 'long_term');
create type observation_category as enum ('academic', 'social', 'emotional', 'creative', 'behavioral', 'other');
create type task_status as enum ('pending', 'in_progress', 'completed', 'reviewed');

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'student',
  nickname text,
  age integer,
  grade integer,
  gender text,
  total_points integer not null default 0,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Assessments table
create table assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  type assessment_type not null,
  source assessment_source not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- User interests table
create table user_interests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null,
  specific text,
  intensity integer check (intensity between 1 and 5),
  source assessment_source not null,
  assessment_id uuid references assessments(id) on delete set null,
  created_at timestamptz not null default now()
);

-- User strengths table
create table user_strengths (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  dimension strength_dimension not null,
  tag_name text not null,
  confidence numeric(3,2) check (confidence between 0 and 1),
  source assessment_source not null,
  created_at timestamptz not null default now()
);

-- User traits (personality) table
create table user_traits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  trait_name text not null,
  score numeric(3,2) check (score between 0 and 1),
  source assessment_source not null,
  assessment_id uuid references assessments(id) on delete set null,
  created_at timestamptz not null default now()
);

-- User goals table
create table user_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  type goal_type not null,
  content text not null,
  achieved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User tasks table
create table user_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  task_id integer not null,
  status task_status not null default 'pending',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Works table (task submissions)
create table works (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  task_id integer,
  title text not null,
  description text,
  reflection text,
  link text,
  tags text[],
  created_at timestamptz not null default now()
);

-- Chat messages table
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  tags text[],
  created_at timestamptz not null default now()
);

-- Council unlocks table
create table council_unlocks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  mentor_id text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, mentor_id)
);

-- Observations table (from admin/counselor)
create table observations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  observer_id uuid references profiles(id) on delete set null not null,
  title text not null,
  category text,
  observation text not null,
  suggested_tags text[],
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index idx_profiles_role on profiles(role);
create index idx_assessments_user_id on assessments(user_id);
create index idx_user_interests_user_id on user_interests(user_id);
create index idx_user_strengths_user_id on user_strengths(user_id);
create index idx_user_traits_user_id on user_traits(user_id);
create index idx_user_goals_user_id on user_goals(user_id);
create index idx_user_tasks_user_id on user_tasks(user_id);
create index idx_user_tasks_status on user_tasks(status);
create index idx_works_user_id on works(user_id);
create index idx_chat_messages_user_id on chat_messages(user_id);
create index idx_council_unlocks_user_id on council_unlocks(user_id);
create index idx_observations_user_id on observations(user_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table assessments enable row level security;
alter table user_interests enable row level security;
alter table user_strengths enable row level security;
alter table user_traits enable row level security;
alter table user_goals enable row level security;
alter table user_tasks enable row level security;
alter table works enable row level security;
alter table chat_messages enable row level security;
alter table council_unlocks enable row level security;
alter table observations enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for user data tables (interests, strengths, traits, goals)
create policy "Users can view own interests"
  on user_interests for select
  using (auth.uid() = user_id);

create policy "Users can insert own interests"
  on user_interests for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all interests"
  on user_interests for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- Similar policies for other user data tables
create policy "Users can view own strengths"
  on user_strengths for select
  using (auth.uid() = user_id);

create policy "Users can insert own strengths"
  on user_strengths for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all strengths"
  on user_strengths for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

create policy "Users can view own traits"
  on user_traits for select
  using (auth.uid() = user_id);

create policy "Users can insert own traits"
  on user_traits for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all traits"
  on user_traits for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

create policy "Users can view own goals"
  on user_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on user_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on user_goals for update
  using (auth.uid() = user_id);

create policy "Admins can view all goals"
  on user_goals for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for assessments
create policy "Users can view own assessments"
  on assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on assessments for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all assessments"
  on assessments for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for user_tasks
create policy "Users can view own tasks"
  on user_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on user_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on user_tasks for update
  using (auth.uid() = user_id);

create policy "Admins can view all tasks"
  on user_tasks for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for works
create policy "Users can view own works"
  on works for select
  using (auth.uid() = user_id);

create policy "Users can insert own works"
  on works for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all works"
  on works for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for chat_messages
create policy "Users can view own messages"
  on chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all messages"
  on chat_messages for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for council_unlocks
create policy "Users can view own unlocks"
  on council_unlocks for select
  using (auth.uid() = user_id);

create policy "Users can insert own unlocks"
  on council_unlocks for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all unlocks"
  on council_unlocks for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- RLS Policies for observations
create policy "Users can view observations about them"
  on observations for select
  using (auth.uid() = user_id);

create policy "Admins can view all observations"
  on observations for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

create policy "Admins can insert observations"
  on observations for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- Create trigger to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_user_goals_updated_at before update on user_goals
  for each row execute function update_updated_at_column();

-- Create trigger to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, nickname, age)
  values (
    new.id,
    'student',
    coalesce(new.raw_user_meta_data->>'nickname', null),
    coalesce((new.raw_user_meta_data->>'age')::integer, null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Insert sample admin user (change email/password after first login)
-- Note: You'll need to sign up this user through Supabase Auth first,
-- then update their role to 'admin' with:
-- update profiles set role = 'admin' where id = '<user_id>';
