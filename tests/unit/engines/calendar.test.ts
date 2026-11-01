import { describe, it, expect } from 'vitest'
import { toJalaali, toGregorian, isLeapJalaaliYear } from 'jalaali-js'

describe('Jalaali Calendar Engine', () => {
  it('converts 1403/01/01 to 2024/03/20', () => {
    const g = toGregorian(1403, 1, 1)
    expect(g.gy).toBe(2024)
    expect(g.gm).toBe(3)
    expect(g.gd).toBe(20)
  })
  it('converts 2024/03/20 to 1403/01/01', () => {
    const j = toJalaali(2024, 3, 20)
    expect(j.jy).toBe(1403)
    expect(j.jm).toBe(1)
    expect(j.jd).toBe(1)
  })
  it('correctly identifies leap year 1403', () => {
    expect(isLeapJalaaliYear(1403)).toBe(true)
  })
  it('correctly identifies non-leap year 1404', () => {
    expect(isLeapJalaaliYear(1404)).toBe(false)
  })
})
