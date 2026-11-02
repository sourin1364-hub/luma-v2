import type { TarotCard } from '../types';
import type { PositionTemplate } from './positionTemplates';
import { getTemplatesForSpread } from './positionTemplates';
import { getPositionSpecificMeaning } from './positionMeanings';

/**
 * تولید معنی موقعیت‌محور برای یک کارت.
 *
 * اولویت:
 * 1. اگر معنی اختصاصی در positionMeanings وجود داشت، از آن استفاده کن.
 * 2. اگر نه، از قالب موقعیت + معنی پایه کارت استفاده کن.
 */
export function generatePositionMeaning(
  spreadId: string,
  positionIndex: number,
  card: TarotCard,
  isReversed: boolean
): string {
  // ۱. بررسی معنی اختصاصی
  const specific = getPositionSpecificMeaning(spreadId, positionIndex, card.id);
  if (specific) return specific;

  // ۲. ترکیب قالب موقعیت + معنی پایه
  const templates = getTemplatesForSpread(spreadId);
  const template = templates[positionIndex];
  const baseMeaning = isReversed ? card.reversed.meaning : card.upright.meaning;

  if (!template) {
    return baseMeaning;
  }

  return `${template.prefix} ${template.connector} ${baseMeaning} ${template.suffix}`;
}

/**
 * تولید راهنمای تفسیر برای LLM (در آینده)
 */
export function generateInterpretationHint(
  spreadId: string,
  positionIndex: number
): string {
  const templates = getTemplatesForSpread(spreadId);
  const template = templates[positionIndex];
  return template?.hint || 'این کارت را در بستر پرسش کاربر تفسیر کن.';
}