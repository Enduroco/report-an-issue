import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPin(pin:string){
  const salt=randomBytes(16).toString('hex');
  const hash=scryptSync(pin,salt,64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin:string,stored:string|null|undefined){
  if(!stored) return false;
  const [salt,hashHex]=stored.split(':');
  if(!salt||!hashHex) return false;
  const actual=scryptSync(pin,salt,64);
  const expected=Buffer.from(hashHex,'hex');
  return expected.length===actual.length && timingSafeEqual(expected,actual);
}

export function validPin(pin:string){
  return /^\d{4}$/.test(pin);
}
