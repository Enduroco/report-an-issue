import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';

export async function GET() {
  const db = adminDb();
  const { data, error } = await db.from('issue_reports').select('*, issue_staff(name)').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ issues: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const required = ['staff_id','issue_type','area','description'];
  for (const key of required) if (!body[key]) return NextResponse.json({ error: `${key} is required` }, { status: 400 });
  const db = adminDb();
  const payload = {
    staff_id: body.staff_id,
    issue_type: body.issue_type,
    area: body.area,
    description: body.description,
    immediate_action: body.immediate_action || null,
    priority: body.priority || 'Medium',
    status: 'New'
  };
  const { data, error } = await db.from('issue_reports').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ issue: data });
}
