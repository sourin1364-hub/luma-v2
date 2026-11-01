import { SiderealTime } from 'astronomy-engine';
import type { AnglePosition } from './types';
import { getSign, getSignDegree } from './constants';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const OBLIQUITY = 23.4393; // degrees, mean obliquity for J2000-ish

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * محاسبه LST (Local Sidereal Time) به درجه.
 */
function getLST(date: Date, longitudeDeg: number): number {
  // SiderealTime در astronomy-engine بر حسب ساعت برمی‌گردد
  const gast = SiderealTime(date); // Greenwich Apparent Sidereal Time (hours)
  const lst = gast * 15 + longitudeDeg; // degrees
  return normalize(lst);
}

/**
 * محاسبه Midheaven (MC) — میانه آسمان.
 * فرمول: MC = atan2(sin(θ), cos(θ) * cos(ε) + tan(φ) * sin(ε))
 *   θ = LST (درجه)، ε = obliquity، φ = latitude
 */
export function getMidheaven(date: Date, latitude: number, longitude: number): AnglePosition {
  const lst = getLST(date, longitude) * DEG_TO_RAD;
  const lat = latitude * DEG_TO_RAD;
  const eps = OBLIQUITY * DEG_TO_RAD;

  const mcRad = Math.atan2(Math.sin(lst), Math.cos(lst) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps));
  const mcDeg = normalize(mcRad * RAD_TO_DEG);

  return {
    longitude: mcDeg,
    sign: getSign(mcDeg).name,
    signDegree: getSignDegree(mcDeg)
  };
}

/**
 * محاسبه Ascendant (ASC) — طالع صعودی.
 * فرمول: ASC = atan2(cos(θ), -sin(θ) * cos(ε) - tan(φ) * sin(ε))
 */
export function getAscendant(date: Date, latitude: number, longitude: number): AnglePosition {
  const lst = getLST(date, longitude) * DEG_TO_RAD;
  const lat = latitude * DEG_TO_RAD;
  const eps = OBLIQUITY * DEG_TO_RAD;

  const ascRad = Math.atan2(Math.cos(lst), -Math.sin(lst) * Math.cos(eps) - Math.tan(lat) * Math.sin(eps));
  const ascDeg = normalize(ascRad * RAD_TO_DEG + 180); // +180 برای تصحیح جهت

  return {
    longitude: ascDeg,
    sign: getSign(ascDeg).name,
    signDegree: getSignDegree(ascDeg)
  };
}