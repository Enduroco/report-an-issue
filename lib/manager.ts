import { cookies } from 'next/headers';

const MANAGER_COOKIE = 'issue_manager_session';
const QC_COOKIE = 'issue_qc_session';
const SITE_COOKIE = 'issue_site_session';

function baseToken() {
  return process.env.MANAGER_SESSION_TOKEN || '';
}

function qcToken() {
  const base = baseToken();
  return base ? `${base}:quality-control` : '';
}

function siteToken() {
  const base = baseToken();
  return base ? `${base}:site-access` : '';
}

export async function isManager() {
  const token = baseToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(MANAGER_COOKIE)?.value === token;
}

export async function isQualityControl() {
  const token = qcToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(QC_COOKIE)?.value === token;
}

export async function hasAdminAccess() {
  return (await isManager()) || (await isQualityControl());
}

export async function hasSiteAccess() {
  const token = siteToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(SITE_COOKIE)?.value === token;
}

export async function setManagerSession() {
  const store = await cookies();
  const token = baseToken();
  if (!token) throw new Error('Missing MANAGER_SESSION_TOKEN');
  store.set(MANAGER_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
}

export async function setQualityControlSession() {
  const store = await cookies();
  const token = qcToken();
  if (!token) throw new Error('Missing MANAGER_SESSION_TOKEN');
  store.set(QC_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
}

export async function setSiteSession() {
  const store = await cookies();
  const token = siteToken();
  if (!token) throw new Error('Missing MANAGER_SESSION_TOKEN');
  store.set(SITE_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
}

export async function clearAdminSessions() {
  const store = await cookies();
  store.delete(MANAGER_COOKIE);
  store.delete(QC_COOKIE);
}

export async function clearSiteSession() {
  const store = await cookies();
  store.delete(SITE_COOKIE);
}
