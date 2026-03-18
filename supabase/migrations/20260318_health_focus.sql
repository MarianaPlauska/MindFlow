-- ─────────────────────────────────────────────
-- 6. meal_logs
-- ─────────────────────────────────────────────
create table meal_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  protein_g numeric(5,2) not null,
  logged_at timestamptz default now()
);
alter table meal_logs enable row level security;
create policy "users own meal logs" on meal_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 7. medication_logs
-- ─────────────────────────────────────────────
create table medication_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  medication_name text not null,
  logged_at timestamptz default now()
);
alter table medication_logs enable row level security;
create policy "users own medication logs" on medication_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
