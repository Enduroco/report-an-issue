import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file supplied' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Photo must be under 8 MB' }, { status: 400 });
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${id}/${crypto.randomUUID()}.${ext}`;
  const db = adminDb();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await db.storage.from('issue-photos').upload(path, bytes, { contentType: file.type || 'image/jpeg', upsert: false });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
  const { data: signed, error: signError } = await db.storage.from('issue-photos').createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (signError) return NextResponse.json({ error: signError.message }, { status: 500 });
  const { error: updateError } = await db.from('issue_reports').update({ photo_path: path, photo_url: signed.signedUrl }).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ ok: true, photo_url: signed.signedUrl });
}
