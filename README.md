# EnduroCo Report an Issue

Private tablet/phone-friendly issue reporting app for EnduroCo.

## Features
- Private site access PIN before the app opens
- Report issues from tablets/phones
- Take a photo directly with the rear camera or select an existing image
- Separate Manager and Quality Control PIN access
- Fixed Responsible Person list: Jason, Josh, Jhon, John R, Danny, Lee-Anne
- Open, Overdue, Closed and All issue filters
- Due dates, corrective actions, completion dates and manager comments
- Quality Control can remove unnecessary reports using a soft-delete audit record
- EnduroCo yellow/black theme

## Vercel environment variables
Existing:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MANAGER_PIN`
- `MANAGER_SESSION_TOKEN`

Add for this version:
- `SITE_ACCESS_PIN` - shared PIN required to open the app
- `SITE_ACCESS_SESSION_TOKEN` - random secret at least 32 characters
- `QUALITY_CONTROL_PIN` - PIN for the Quality Control user
- `QUALITY_CONTROL_SESSION_TOKEN` - separate random secret at least 32 characters

## Existing Supabase database update
Add these nullable columns to the existing `issues` table:
- `deleted_at` type `timestamptz`
- `deleted_reason` type `text`

The app hides rows where `deleted_at` is populated. This allows Quality Control to remove an unnecessary report from normal use without destroying the audit trace.

## Storage
Private Supabase Storage bucket: `issue-photos`
