# EnduroCo Vehicle Time Tracker - Victoria / Pause / Reset update

This version adds:
- All displayed and exported times in `Australia/Melbourne` (Victoria), including daylight saving.
- PAUSE / RESUME for active jobs. Paused time is excluded from labour hours.
- Larger tablet-friendly controls and yellow/black workshop styling.
- Manager-only RESET ALL STAFF PINS.
- Manager-only CLEAR ALL TIME RECORDS.
- Manager-only CLEAR TIME + VEHICLES.
- Existing staff, vehicles, due dates, actual finish dates, reporting, CSV export and correction audit history.

## Required Supabase migration
Add these columns to `time_entries` before deploying:
- `paused_at` - `timestamptz`, nullable
- `total_paused_seconds` - `int4` / integer, not null, default `0`

Or run `pause_migration.sql`.

## Reset controls
After deployment:
- Manager Staff -> RESET ALL STAFF PINS. This keeps staff names but clears every staff PIN. Assign a new PIN to each staff member using Edit / Reset PIN.
- Manager Dashboard -> System maintenance -> CLEAR ALL TIME RECORDS to remove time data but keep staff and vehicles.
- Manager Dashboard -> System maintenance -> CLEAR TIME + VEHICLES to remove time data and vehicle records but keep staff.

Each destructive reset requires a browser confirmation and typing `RESET`.

## Environment variables
No new Vercel environment variables are required. Keep the existing:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- MANAGER_PIN
- MANAGER_SESSION_TOKEN
