import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
export async function GET(){
  try{
    const db=supabaseAdmin();
    const [{data:staff,error:s1},{data:vehicles,error:s2},{data:entries,error:s3},{data:corrections,error:s4}]=await Promise.all([
      db.from('staff').select('id,name,active,created_at').order('name'),
      db.from('vehicles').select('*').order('created_at',{ascending:false}),
      db.from('time_entries').select('*,staff(name),vehicles(job_number,customer,vehicle_type,budget_hours,status,due_date,actual_finished_date)').order('started_at',{ascending:false}).limit(2000),
      db.from('time_entry_corrections').select('*').order('corrected_at',{ascending:false}).limit(200)
    ]);
    if(s1||s2||s3||s4) throw s1||s2||s3||s4;
    return NextResponse.json({staff,vehicles,entries,corrections});
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
