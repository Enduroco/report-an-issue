import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';
import { isManager } from '@/lib/manager';

export async function GET() {
  const db = adminDb();
  const { data, error } = await db.from('report_issue_staff').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ staff: data });
}
export async function POST(req: Request) {
  if (!(await isManager())) return NextResponse.json({ error: 'Manager login required' }, { status: 401 });
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const db = adminDb();
  const { error } = await db.from('report_issue_staff').insert({ name: name.trim(), active: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
