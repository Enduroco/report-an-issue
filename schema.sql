create extension if not exists pgcrypto;

create table if not exists report_issue_staff (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  staff_name text not null,
  reported_at timestamptz not null default now(),
  issue_type text not null,
  location text not null,
  description text not null,
  immediate_action text,
  priority text not null default 'Medium',
  photo_path text,
  responsible_person text,
  due_date date,
  corrective_action text,
  status text not null default 'Open',
  completion_date date,
  manager_comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_reason text
);

create table if not exists issue_history (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid,
  old_status text,
  new_status text,
  comment text,
  changed_at timestamptz not null default now()
);

alter table report_issue_staff enable row level security;
alter table issues enable row level security;
alter table issue_history enable row level security;
