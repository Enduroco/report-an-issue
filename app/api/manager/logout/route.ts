import { NextResponse } from 'next/server';
import { clearAdminSessions } from '@/lib/manager';
export async function POST() { await clearAdminSessions(); return NextResponse.json({ ok: true }); }
