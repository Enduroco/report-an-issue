import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';
import { isQualityControl } from '@/lib/manager';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isQualityControl())) return NextResponse.json({ error: 'Quality Control login required' }, { status: 401 });
  const { id } = await params;
  const { reason } = await req.json();
  if (!reason?.trim()) return NextResponse.json({ error: 'Deletion reason is required' }, { status: 400 });
  const db = adminDb();
  const { error } = await db.from('issues').update({
    deleted_at: new Date().toISOString(),
    deleted_reason: reason.trim(),
    updated_at: new Date().toISOString()
  }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
