import { NextResponse } from 'next/server';
import { clearManagerSession } from '@/lib/manager';
export async function POST() { await clearManagerSession(); return NextResponse.json({ ok: true }); }
