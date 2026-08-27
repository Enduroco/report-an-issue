import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { entry_id, action } = await req.json();
    if (!entry_id || !['pause', 'resume'].includes(action)) return NextResponse.json({ error: 'Invalid pause request.' }, { status: 400 });
    const db = supabaseAdmin();
    const { data: entry, error: readError } = await db.from('time_entries').select('id,ended_at,paused_at,total_paused_seconds').eq('id', entry_id).single();
    if (readError) throw readError;
    if (entry.ended_at) return NextResponse.json({ error: 'This job has already been stopped.' }, { status: 400 });

    if (action === 'pause') {
      if (entry.paused_at) return NextResponse.json({ ok: true });
      const { error } = await db.from('time_entries').update({ paused_at: new Date().toISOString() }).eq('id', entry_id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (!entry.paused_at) return NextResponse.json({ ok: true });
    const extra = Math.max(0, Math.floor((Date.now() - new Date(entry.paused_at).getTime()) / 1000));
    const total = Number(entry.total_paused_seconds || 0) + extra;
    const { error } = await db.from('time_entries').update({ paused_at: null, total_paused_seconds: total }).eq('id', entry_id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unable to pause/resume job.' }, { status: 500 });
  }
}
