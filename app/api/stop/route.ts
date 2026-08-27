import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
export async function POST(req:NextRequest){
  try{
    const {entry_id}=await req.json();
    const db=supabaseAdmin();
    const {data:entry,error:readError}=await db.from('time_entries').select('paused_at,total_paused_seconds,ended_at').eq('id',entry_id).single();
    if(readError) throw readError;
    if(entry.ended_at) return NextResponse.json({ok:true});
    let total=Number(entry.total_paused_seconds||0);
    if(entry.paused_at) total+=Math.max(0,Math.floor((Date.now()-new Date(entry.paused_at).getTime())/1000));
    const {error}=await db.from('time_entries').update({ended_at:new Date().toISOString(),paused_at:null,total_paused_seconds:total}).eq('id',entry_id).is('ended_at',null);
    if(error) throw error;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
