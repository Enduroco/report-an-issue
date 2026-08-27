import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isManager } from '../../../../lib/manager';

export async function POST(req: NextRequest) {
  if (!(await isManager())) return NextResponse.json({ error: 'Manager access required.' }, { status: 401 });
  try {
    const { action } = await req.json();
    const db = supabaseAdmin();

    if (action === 'reset_pins') {
      const { error } = await db.from('staff').update({ pin_hash: null }).not('id', 'is', null);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (action === 'clear_time') {
      const { error: c } = await db.from('time_entry_corrections').delete().not('id', 'is', null);
      if (c) throw c;
      const { error: t } = await db.from('time_entries').delete().not('id', 'is', null);
      if (t) throw t;
      return NextResponse.json({ ok: true });
    }

    if (action === 'clear_time_vehicles') {
      const { error: c } = await db.from('time_entry_corrections').delete().not('id', 'is', null);
      if (c) throw c;
      const { error: t } = await db.from('time_entries').delete().not('id', 'is', null);
      if (t) throw t;
      const { error: v } = await db.from('vehicles').delete().not('id', 'is', null);
      if (v) throw v;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown system action.' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'System action failed.' }, { status: 500 });
  }
}
