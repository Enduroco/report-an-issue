import { NextResponse } from 'next/server';
import { clearSiteSession } from '@/lib/manager';
export async function POST(){ await clearSiteSession(); return NextResponse.json({ok:true}); }
