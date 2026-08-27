import { NextRequest, NextResponse } from 'next/server';
export async function POST(req:NextRequest){
  const {pin}=await req.json();
  if(!process.env.MANAGER_PIN||pin!==process.env.MANAGER_PIN) return NextResponse.json({error:'Incorrect manager PIN.'},{status:401});
  const token=process.env.MANAGER_SESSION_TOKEN;
  if(!token) return NextResponse.json({error:'Manager session token is not configured.'},{status:500});
  const res=NextResponse.json({ok:true});
  res.cookies.set('manager_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*12});
  return res;
}
