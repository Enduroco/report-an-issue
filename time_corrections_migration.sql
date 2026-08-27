create table if not exists time_entry_corrections (
  id uuid primary key default gen_random_uuid(),
  time_entry_id uuid not null references time_entries(id) on delete cascade,
  old_started_at timestamptz not null,
  old_ended_at timestamptz,
  new_started_at timestamptz not null,
  new_ended_at timestamptz,
  reason text not null,
  corrected_at timestamptz not null default now()
);

alter table time_entry_corrections enable row level security;

create index if not exists time_entry_corrections_entry_idx
  on time_entry_corrections(time_entry_id);
