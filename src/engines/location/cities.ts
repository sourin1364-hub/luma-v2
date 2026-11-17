import type { Province, CityWithProvince } from './types';
import { getAssetUrl } from '../../utils/assetPath';

let cachedProvinces: Province[] | null = null;
let cachedCities: CityWithProvince[] | null = null;

export async function loadProvinces(): Promise<Province[]> {
  if (cachedProvinces) return cachedProvinces;
  const response = await fetch(getAssetUrl('data/iran-provinces.json'));
  if (!response.ok) {
    throw new Error('خطا در بارگذاری لیست استان‌ها');
  }
  const data: Province[] = await response.json();
  cachedProvinces = data;
  return data;
}

export async function loadCities(): Promise<CityWithProvince[]> {
  if (cachedCities) return cachedCities;
  const [citiesRes, provincesRes] = await Promise.all([
    fetch(getAssetUrl('data/iran-cities.json')),
    fetch(getAssetUrl('data/iran-provinces.json')),
  ]);

  if (!citiesRes.ok || !provincesRes.ok) {
    throw new Error('خطا در بارگذاری اطلاعات شهرها');
  }

  const rawCities: any[] = await citiesRes.json();
  const provinces: Province[] = await provincesRes.json();
  cachedProvinces = provinces;

  const provinceMap = new Map<number, string>();
  const provinceEnglishMap = new Map<number, string>();
  provinces.forEach((p) => {
    provinceMap.set(p.id, p.name);
    provinceEnglishMap.set(p.id, p.en_name);
  });

  cachedCities = rawCities.map((c) => ({
    id: Number(c.id),
    name: String(c.name || ''),
    en_name: String(c.en_name || c.nameEn || ''),
    province_id: Number(c.province_id || 0),
    province_name: String(c.province_name || provinceMap.get(Number(c.province_id)) || 'ایران'),
    province_en_name: String(c.province_en_name || provinceEnglishMap.get(Number(c.province_id)) || ''),
    lat: Number(c.lat || 35.6892),
    lon: Number(c.lon || 51.3890),
    timezone: String(c.timezone || 'Asia/Tehran'),
  }));

  return cachedCities;
}

export async function loadCitiesWithProvinces(): Promise<CityWithProvince[]> {
  return loadCities();
}

export async function searchCities(query: string): Promise<CityWithProvince[]> {
  const all = await loadCities();
  const q = query.trim().toLowerCase();
  if (!q) return all.slice(0, 30);
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.en_name && c.en_name.toLowerCase().includes(q)) ||
      (c.province_name && c.province_name.toLowerCase().includes(q))
  );
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearestCity(lat: number, lon: number): Promise<CityWithProvince | null> {
  const all = await loadCities();
  if (!all.length) return null;

  let nearest = all[0];
  let minDistance = haversineDistance(lat, lon, nearest.lat, nearest.lon);

  for (let i = 1; i < all.length; i++) {
    const d = haversineDistance(lat, lon, all[i].lat, all[i].lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = all[i];
    }
  }
  return nearest;
}
