import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isManager } from '../../../../lib/manager';
import { melbourneLocalToIso } from '../../../../lib/time';

export async function POST(req: NextRequest){
  if(!(await isManager())) return NextResponse.json({error:'Manager access required.'},{status:401});
  try{
    const body=await req.json();
    const {id,started_at,ended_at,reason}=body;
    if(!id||!started_at||!ended_at) return NextResponse.json({error:'Start time and finish time are required.'},{status:400});
    if(!String(reason||'').trim()) return NextResponse.json({error:'Please enter a reason for the correction.'},{status:400});
    const startIso=melbourneLocalToIso(String(started_at));
    const endIso=melbourneLocalToIso(String(ended_at));
    const start=new Date(startIso),end=new Date(endIso);
    if(end<=start) return NextResponse.json({error:'Finish time must be after start time.'},{status:400});
    const db=supabaseAdmin();
    const {data:existing,error:readError}=await db.from('time_entries').select('id,started_at,ended_at').eq('id',id).single();
    if(readError) throw readError;
    if(!existing.ended_at) return NextResponse.json({error:'Stop the active job before correcting its time.'},{status:400});
    const {error:auditError}=await db.from('time_entry_corrections').insert({time_entry_id:id,old_started_at:existing.started_at,old_ended_at:existing.ended_at,new_started_at:startIso,new_ended_at:endIso,reason:String(reason).trim()});
    if(auditError) throw auditError;
    const {error:updateError}=await db.from('time_entries').update({started_at:startIso,ended_at:endIso}).eq('id',id);
    if(updateError) throw updateError;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
