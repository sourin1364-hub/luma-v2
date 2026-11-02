export interface City {
  id: number;
  name: string;
  en_name: string;
  province_id: number;
  lat: number | string;
  lon: number | string;
}

export interface Province {
  id: number;
  name: string;
  en_name: string;
}

export interface CityWithProvince extends City {
  lat: number;
  lon: number;
  province_name: string;
  timezone: string;
}