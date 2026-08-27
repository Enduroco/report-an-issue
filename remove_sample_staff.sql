-- One-time cleanup for the original prototype sample staff.
-- This intentionally removes their TEST time entries first, then removes the sample staff.
-- Jason is not included because Jason is a real EnduroCo staff member.

delete from time_entries
where staff_id in (
  select id from staff where name in ('Alex', 'Ben', 'Chris', 'Daniel')
);

delete from staff
where name in ('Alex', 'Ben', 'Chris', 'Daniel');
