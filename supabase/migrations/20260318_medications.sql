-- ─────────────────────────────────────────────
-- 8. medication_routines
-- ─────────────────────────────────────────────
create table medication_routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  scheduled_time text not null, -- format HH:mm
  created_at timestamptz default now()
);
alter table medication_routines enable row level security;
create policy "users own medication routines" on medication_routines
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
