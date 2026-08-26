import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';
import { hasSiteAccess } from '@/lib/manager';

export async function GET() {
  if (!(await hasSiteAccess())) return NextResponse.json({ error: 'Site login required' }, { status: 401 });
  const db = adminDb();
  const { data, error } = await db.from('issues').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const issues = await Promise.all((data || []).map(async (issue) => {
    if (!issue.photo_path) return { ...issue, photo_url: null };
    const { data: signed } = await db.storage.from('issue-photos').createSignedUrl(issue.photo_path, 60 * 60);
    return { ...issue, photo_url: signed?.signedUrl || null };
  }));
  return NextResponse.json({ issues });
}

export async function POST(req: Request) {
  if (!(await hasSiteAccess())) return NextResponse.json({ error: 'Site login required' }, { status: 401 });
  const body = await req.json();
  const required = ['staff_name','issue_type','location','description'];
  for (const key of required) if (!body[key]) return NextResponse.json({ error: `${key} is required` }, { status: 400 });
  const db = adminDb();
  const payload = {
    staff_name: body.staff_name,
    issue_type: body.issue_type,
    location: body.location,
    description: body.description,
    immediate_action: body.immediate_action || null,
    priority: body.priority || 'Medium',
    status: 'Open',
    reported_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const { data, error } = await db.from('issues').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ issue: data });
}
