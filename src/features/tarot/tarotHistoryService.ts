import { supabase } from '../../lib/supabase';
import type { ReadingResult, ReadingInterpretation } from '../../engines/tarot';
import { getCardById, getSpreadById } from '../../engines/tarot';

export interface SavedReading {
  id: string;
  spreadId: string;
  spreadName: string;
  question: string;
  cards: {
    cardId: string;
    name: string;
    isReversed: boolean;
    positionIndex: number;
  }[];
  interpretation: string | null;
  advice: string | null;
  createdAt: string;
}

export async function saveReading(
  userId: string,
  reading: ReadingResult,
  interpretation?: ReadingInterpretation
): Promise<string> {
  const cardsData = reading.drawnCards.map((d) => {
    const card = getCardById(d.cardId);
    return {
      cardId: d.cardId,
      name: card?.nameFa || '',
      isReversed: d.isReversed,
      positionIndex: d.positionIndex,
    };
  });

  const { data, error } = await supabase
    .from('tarot_readings')
    .insert({
      user_id: userId,
      spread_id: reading.spreadId,
      question: reading.question,
      cards: cardsData,
      interpretation: interpretation?.summary || null,
      advice: interpretation?.advice || null,
    })
    .select('id')
    .single();

  if (error) throw new Error('خطا در ذخیره فال: ' + error.message);
  return data.id;
}

export async function getReadings(userId: string): Promise<SavedReading[]> {
  const { data, error } = await supabase
    .from('tarot_readings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching readings:', error);
    return [];
  }

  return (data || []).map((d) => {
    const spread = getSpreadById(d.spread_id);
    return {
      id: d.id,
      spreadId: d.spread_id,
      spreadName: spread?.nameFa || d.spread_id,
      question: d.question || '',
      cards: d.cards || [],
      interpretation: d.interpretation || null,
      advice: d.advice || null,
      createdAt: d.created_at,
    };
  });
}

export async function deleteReading(readingId: string): Promise<void> {
  const { error } = await supabase.from('tarot_readings').delete().eq('id', readingId);
  if (error) throw new Error('خطا در حذف فال: ' + error.message);
}