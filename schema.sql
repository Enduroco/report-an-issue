create extension if not exists pgcrypto;

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  job_number text not null unique,
  customer text,
  vehicle_type text not null,
  registration text,
  vin text,
  budget_hours numeric(10,2) not null default 0,
  status text not null default 'Active' check (status in ('Active','On Hold','Completed')),
  description text,
  due_date date,
  actual_finished_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id),
  vehicle_id uuid not null references vehicles(id),
  task text not null,
  notes text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists one_open_entry_per_staff
on time_entries(staff_id)
where ended_at is null;

-- Staff are added through Manager Staff. No sample staff are created automatically.

alter table staff enable row level security;
alter table vehicles enable row level security;
alter table time_entries enable row level security;

-- Staff PIN support (run this section on existing databases)
alter table staff add column if not exists pin_hash text;

-- Vehicle scheduling support (safe to run on existing databases)
alter table vehicles add column if not exists due_date date;
alter table vehicles add column if not exists actual_finished_date date;

-- Pause / resume support (safe to run on existing databases)
alter table time_entries add column if not exists paused_at timestamptz;
alter table time_entries add column if not exists total_paused_seconds integer not null default 0;
