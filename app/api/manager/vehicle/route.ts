import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isManager } from '../../../../lib/manager';
export async function POST(req:NextRequest){
  if(!(await isManager())) return NextResponse.json({error:'Manager access required.'},{status:401});
  try{
    const body=await req.json();
    const db=supabaseAdmin();
    const status=body.status||'Active';
    const actualFinishedDate=body.actual_finished_date||((status==='Completed')?new Date().toISOString().slice(0,10):null);
    const record={job_number:body.job_number,customer:body.customer||null,vehicle_type:body.vehicle_type,registration:body.registration||null,vin:body.vin||null,budget_hours:Number(body.budget_hours)||0,status,description:body.description||null,due_date:body.due_date||null,actual_finished_date:actualFinishedDate,updated_at:new Date().toISOString()};
    if(!record.job_number||!record.vehicle_type) return NextResponse.json({error:'Job number and vehicle type are required.'},{status:400});
    const q=body.id?db.from('vehicles').update(record).eq('id',body.id):db.from('vehicles').insert(record);
    const {error}=await q;if(error) throw error;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
