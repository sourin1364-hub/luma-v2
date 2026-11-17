import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isResearchCoverAspectRatioValid,
  MAX_RESEARCH_COVER_BYTES,
  validateResearchCoverFile,
} from '@/features/research/researchService';

vi.mock('@/lib/supabase', () => ({ supabase: {} }));

function makeImage(size: number): File {
  return new File([new Uint8Array(size)], 'cover.webp', { type: 'image/webp' });
}

describe('research article cover validation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts only the exact vertical 4:5 ratio', () => {
    expect(isResearchCoverAspectRatioValid(800, 1000)).toBe(true);
    expect(isResearchCoverAspectRatioValid(400, 500)).toBe(true);
    expect(isResearchCoverAspectRatioValid(800, 1001)).toBe(false);
    expect(isResearchCoverAspectRatioValid(1000, 800)).toBe(false);
  });

  it('rejects files at or above the 100 KiB limit before decoding', async () => {
    const decode = vi.fn();
    vi.stubGlobal('createImageBitmap', decode);

    expect(await validateResearchCoverFile(makeImage(MAX_RESEARCH_COVER_BYTES))).toBe('research_form_image_size');
    expect(decode).not.toHaveBeenCalled();
  });

  it('rejects covers whose decoded dimensions are not 4:5', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      width: 900,
      height: 1000,
      close: vi.fn(),
    }));

    expect(await validateResearchCoverFile(makeImage(64))).toBe('research_form_image_ratio');
  });

  it('accepts a valid image below the size limit', async () => {
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      width: 800,
      height: 1000,
      close,
    }));

    expect(await validateResearchCoverFile(makeImage(MAX_RESEARCH_COVER_BYTES - 1))).toBeNull();
    expect(close).toHaveBeenCalledOnce();
  });
});
