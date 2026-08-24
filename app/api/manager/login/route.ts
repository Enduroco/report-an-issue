import { NextResponse } from 'next/server';
import { setManagerSession } from '@/lib/manager';
export async function POST(req: Request) {
  const { pin } = await req.json();
  if (!process.env.MANAGER_PIN || String(pin) !== String(process.env.MANAGER_PIN)) return NextResponse.json({ error: 'Incorrect manager PIN' }, { status: 401 });
  await setManagerSession();
  return NextResponse.json({ ok: true });
}
