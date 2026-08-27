export const MELBOURNE_TZ = 'Australia/Melbourne';

function offsetMinutesAt(date: Date) {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: MELBOURNE_TZ,
    timeZoneName: 'shortOffset',
    hour: '2-digit'
  }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value || 'GMT+10';
  const m = part.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 600;
  const mins = Number(m[2]) * 60 + Number(m[3] || 0);
  return m[1] === '-' ? -mins : mins;
}

export function melbourneLocalToIso(value: string) {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) throw new Error('Invalid Victoria date/time.');
  const wallAsUtc = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), 0, 0);
  let guess = new Date(wallAsUtc);
  let offset = offsetMinutesAt(guess);
  guess = new Date(wallAsUtc - offset * 60000);
  const correctedOffset = offsetMinutesAt(guess);
  if (correctedOffset !== offset) guess = new Date(wallAsUtc - correctedOffset * 60000);
  return guess.toISOString();
}
