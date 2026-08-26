# EnduroCo Report an Issue

Tablet-friendly internal issue reporting app for EnduroCo.

## Supabase tables used
- `report_issue_staff` — separate staff list for issue reporting
- `issues` — issue records
- `issue_history` — reserved for issue history/audit records

## Storage
Create a private bucket named `issue-photos`.

## Environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MANAGER_PIN`
- `MANAGER_SESSION_TOKEN`

## Staff list
The Report an Issue app deliberately uses `report_issue_staff`, not the Time Tracker `staff` table, so the two apps can have different active staff lists.
