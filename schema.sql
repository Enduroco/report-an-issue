create extension if not exists pgcrypto;

create table if not exists issue_staff (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists issue_reports (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references issue_staff(id),
  issue_type text not null,
  area text not null,
  description text not null,
  immediate_action text,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  status text not null default 'New' check (status in ('New','Under Review','Action Required','Closed')),
  responsible_person text,
  due_date date,
  completion_date date,
  corrective_action text,
  manager_comments text,
  photo_path text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists issue_reports_status_idx on issue_reports(status);
create index if not exists issue_reports_due_date_idx on issue_reports(due_date);
create index if not exists issue_reports_created_at_idx on issue_reports(created_at desc);

alter table issue_staff enable row level security;
alter table issue_reports enable row level security;

insert into issue_staff(name) values
  ('Jason'),('Nat'),('Paul'),('Sam'),('Jayden'),('Joseph')
on conflict(name) do nothing;
