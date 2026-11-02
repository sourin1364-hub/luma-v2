import { describe, it, expect } from 'vitest';
import { calculateAbjad } from '@/engines/numerology';

describe('Abjad debug', () => {
  it('قدم خیر should be 954', () => {
    const result = calculateAbjad('قدم خیر');
    console.log('normalized:', result.normalized);
    console.log('breakdown:', result.breakdown);
    console.log('total:', result.total);
    expect(result.total).toBe(954);
  });
});