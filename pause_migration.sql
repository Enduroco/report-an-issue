alter table time_entries add column if not exists paused_at timestamptz;
alter table time_entries add column if not exists total_paused_seconds integer not null default 0;
