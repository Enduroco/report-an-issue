import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';
import { hasAdminAccess } from '@/lib/manager';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) return NextResponse.json({ error: 'Manager login required' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const allowed = ['priority','responsible_person','due_date','status','completion_date','manager_comments','corrective_action'];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k] || null;
  if (body.status === 'Closed' && !body.completion_date) update.completion_date = new Date().toISOString().slice(0,10);
  update.updated_at = new Date().toISOString();
  const db = adminDb();
  const { error } = await db.from('issues').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
