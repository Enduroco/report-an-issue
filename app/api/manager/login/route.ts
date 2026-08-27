import { NextResponse } from 'next/server';
import { setManagerSession, setQualityControlSession } from '@/lib/manager';
export async function POST(req: Request) {
  const { pin } = await req.json();
  if (process.env.MANAGER_PIN && String(pin) === String(process.env.MANAGER_PIN)) {
    await setManagerSession();
    return NextResponse.json({ ok: true, role: 'manager' });
  }
  if (process.env.QUALITY_CONTROL_PIN && String(pin) === String(process.env.QUALITY_CONTROL_PIN)) {
    await setQualityControlSession();
    return NextResponse.json({ ok: true, role: 'quality_control' });
  }
  return NextResponse.json({ error: 'Incorrect manager or Quality Control PIN' }, { status: 401 });
}
