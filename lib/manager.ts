import { cookies } from 'next/headers';

const COOKIE = 'issue_manager_session';

export async function isManager() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return !!token && token === process.env.MANAGER_SESSION_TOKEN;
}

export async function setManagerSession() {
  const store = await cookies();
  const token = process.env.MANAGER_SESSION_TOKEN;
  if (!token) throw new Error('Missing MANAGER_SESSION_TOKEN');
  store.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
}

export async function clearManagerSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
