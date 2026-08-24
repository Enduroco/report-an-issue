# EnduroCo Report an Issue

Tablet-friendly issue reporting app using Next.js, Vercel and the existing EnduroCo Apps Supabase project.

## Environment variables
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
MANAGER_PIN
MANAGER_SESSION_TOKEN

## Supabase setup
1. Run schema.sql in SQL Editor.
2. In Storage, create a private bucket named `issue-photos`.
3. Deploy to Vercel with the environment variables above.

## Features
- Staff issue submission
- Automatic timestamp
- Category, area, description, immediate action and priority
- Optional photo upload
- Manager PIN access
- Issue register and status workflow
- Responsible person, due date, corrective action, completion date and manager comments
- Open, closed, high-priority and overdue summaries
