import { NextResponse } from 'next/server';
import { hasSiteAccess } from '@/lib/manager';
export async function GET() { return NextResponse.json({ access: await hasSiteAccess() }); }
