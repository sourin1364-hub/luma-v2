export interface BirthProfile {
  id?: string;
  year: number;
  month: number;
  day: number;
  birthTime: string;
  birthCity: string;
  birthCityEn: string;
  birthProvince: string;
  latitude: number;
  longitude: number;
  timezone: string;
  motherName: string;
}

export interface ProfileData {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}