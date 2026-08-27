import { NextResponse } from 'next/server';
import { isManager, isQualityControl } from '@/lib/manager';
export async function GET() {
  const manager = await isManager();
  const qualityControl = await isQualityControl();
  return NextResponse.json({ manager, qualityControl, admin: manager || qualityControl });
}
