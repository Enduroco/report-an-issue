import { cookies } from 'next/headers';
export async function isManager(){
  const store=await cookies();
  return Boolean(process.env.MANAGER_SESSION_TOKEN) && store.get('manager_session')?.value===process.env.MANAGER_SESSION_TOKEN;
}
