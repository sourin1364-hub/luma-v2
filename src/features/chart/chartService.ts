import { supabase } from '../../lib/supabase';
import type { NatalChart } from '../../engines/astronomy/types';
import type { JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import type { TimeValue } from '../../components/ui/TimePicker';
import type { CityWithProvince } from '../../engines/location';

export interface SavedChart {
  id: string;
  inputData: {
    birthDate: JalaaliDateValue;
    birthTime: TimeValue;
    city: CityWithProvince;
  };
  resultData: NatalChart;
  createdAt: string;
}

/**
 * ذخیره چارت در Supabase
 */
export async function saveChart(
  userId: string,
  birthDate: JalaaliDateValue,
  birthTime: TimeValue,
  city: CityWithProvince,
  chart: NatalChart
): Promise<string> {
  const inputData = { birthDate, birthTime, city };
  const { data, error } = await supabase
    .from('saved_charts')
    .insert({
      user_id: userId,
      input_data: inputData,
      result_data: chart,
      calculation_version: chart.version || '1.0.0',
    })
    .select('id')
    .single();

  if (error) throw new Error('خطا در ذخیره چارت: ' + error.message);
  return data.id;
}

/**
 * دریافت آخرین چارت ذخیره‌شده
 */
export async function getLatestChart(userId: string): Promise<SavedChart | null> {
  const { data, error } = await supabase
    .from('saved_charts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching chart:', error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    inputData: data.input_data,
    resultData: data.result_data,
    createdAt: data.created_at,
  };
}

/**
 * دریافت همه چارت‌های ذخیره‌شده
 */
export async function getAllCharts(userId: string): Promise<SavedChart[]> {
  const { data, error } = await supabase
    .from('saved_charts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching charts:', error);
    return [];
  }

  return (data || []).map((d) => ({
    id: d.id,
    inputData: d.input_data,
    resultData: d.result_data,
    createdAt: d.created_at,
  }));
}

/**
 * حذف چارت
 */
export async function deleteChart(chartId: string): Promise<void> {
  const { error } = await supabase.from('saved_charts').delete().eq('id', chartId);
  if (error) throw new Error('خطا در حذف چارت: ' + error.message);
}