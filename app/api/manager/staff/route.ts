import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isManager } from '../../../../lib/manager';
import { hashPin, validPin } from '../../../../lib/pin';

export async function POST(req:NextRequest){
  if(!(await isManager())) return NextResponse.json({error:'Manager access required.'},{status:401});
  try{
    const body=await req.json();
    const name=String(body.name||'').trim();
    const pin=String(body.pin||'');
    const active=body.active!==false;
    if(!name) return NextResponse.json({error:'Employee name is required.'},{status:400});
    if(!body.id && !validPin(pin)) return NextResponse.json({error:'A new employee needs a 4-digit PIN.'},{status:400});
    if(pin && !validPin(pin)) return NextResponse.json({error:'PIN must be exactly 4 digits.'},{status:400});

    const db=supabaseAdmin();
    const record:any={name,active};
    if(pin) record.pin_hash=hashPin(pin);
    const q=body.id?db.from('staff').update(record).eq('id',body.id):db.from('staff').insert(record);
    const {error}=await q;
    if(error) throw error;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
