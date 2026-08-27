alter table public.vehicles
  add column if not exists due_date date;

alter table public.vehicles
  add column if not exists actual_finished_date date;
