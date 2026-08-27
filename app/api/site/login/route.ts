import { NextResponse } from 'next/server';
import { setSiteSession } from '@/lib/manager';

export async function POST(req: Request) {
  const { pin } = await req.json();
  if (!process.env.SITE_PIN || String(pin) !== String(process.env.SITE_PIN)) {
    return NextResponse.json({ error: 'Incorrect access PIN' }, { status: 401 });
  }
  await setSiteSession();
  return NextResponse.json({ ok: true });
}
