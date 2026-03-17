-- MindFlow Expansion — Migrations
-- Run in order in Supabase Studio SQL Editor
-- Project: opjoyiougllhinzuyhwq

-- ─────────────────────────────────────────────
-- 1. habits
-- ─────────────────────────────────────────────
create table habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  due_date date,
  is_completed boolean default false,
  completed_at timestamptz,
  habit_type text default 'task', -- 'task' | 'protein'
  created_at timestamptz default now()
);
alter table habits enable row level security;
create policy "users own habits" on habits
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 2. workout_exercises
-- ─────────────────────────────────────────────
create table workout_exercises (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  is_completed boolean default false,
  workout_date date default current_date,
  created_at timestamptz default now()
);
alter table workout_exercises enable row level security;
create policy "users own exercises" on workout_exercises
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. workout_sets
-- RLS via subquery — sem user_id redundante
-- ─────────────────────────────────────────────
create table workout_sets (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid references workout_exercises(id) on delete cascade not null,
  set_number integer not null,
  weight_kg numeric(5,2) not null,
  reps integer not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);
alter table workout_sets enable row level security;
create policy "users own workout sets" on workout_sets
  for all
  using (exists (
    select 1 from workout_exercises e
    where e.id = workout_sets.exercise_id
      and e.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from workout_exercises e
    where e.id = workout_sets.exercise_id
      and e.user_id = auth.uid()
  ));

-- ─────────────────────────────────────────────
-- 4. financial_goals
-- ─────────────────────────────────────────────
create table financial_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  created_at timestamptz default now()
);
alter table financial_goals enable row level security;
create policy "users own financial goals" on financial_goals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5. Seed opcional — dados de exemplo
-- (Substitua o UUID pelo seu user_id real)
-- ─────────────────────────────────────────────
-- insert into workout_exercises (user_id, name, workout_date) values
--   ('YOUR_USER_UUID', 'Cross Polia Alta', current_date),
--   ('YOUR_USER_UUID', 'Desenvolvimento Máquina', current_date);

-- insert into financial_goals (user_id, title, target_amount, current_amount) values
--   ('YOUR_USER_UUID', '50k', 50000, 0),
--   ('YOUR_USER_UUID', 'Carro', 80000, 0);

-- insert into habits (user_id, title, due_date, habit_type) values
--   ('YOUR_USER_UUID', 'Dieta', current_date, 'protein');
