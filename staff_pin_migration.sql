-- Run this once in Supabase SQL Editor before deploying the PIN-enabled app.
alter table staff add column if not exists pin_hash text;
