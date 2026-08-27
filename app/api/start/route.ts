import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyPin, validPin } from '../../../lib/pin';

export async function POST(req:NextRequest){
  try{
    const {staff_id,staff_pin,vehicle_id,task,notes}=await req.json();
    if(!staff_id||!vehicle_id||!task) return NextResponse.json({error:'Employee, vehicle and task are required.'},{status:400});
    if(!validPin(String(staff_pin||''))) return NextResponse.json({error:'Enter your 4-digit staff PIN.'},{status:400});
    const db=supabaseAdmin();

    const {data:staff,error:staffErr}=await db.from('staff').select('id,active,pin_hash').eq('id',staff_id).single();
    if(staffErr||!staff||!staff.active) return NextResponse.json({error:'Employee is not active.'},{status:400});
    if(!verifyPin(String(staff_pin),staff.pin_hash)) return NextResponse.json({error:'Incorrect staff PIN.'},{status:401});

    const {data:vehicle}=await db.from('vehicles').select('status').eq('id',vehicle_id).single();
    if(!vehicle||vehicle.status!=='Active') return NextResponse.json({error:'This vehicle is not Active.'},{status:400});
    const {data:open}=await db.from('time_entries').select('id').eq('staff_id',staff_id).is('ended_at',null).maybeSingle();
    if(open) return NextResponse.json({error:'This employee already has an active job.'},{status:409});
    const {error}=await db.from('time_entries').insert({staff_id,vehicle_id,task,notes:notes||null});
    if(error) throw error;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
