import { describe, expect, it } from 'vitest'
import { balanceColumns } from '../../src/lib/grid'

describe('balanceColumns', () => {
  it('keeps the columns when every row is full or the list fits one row', () => {
    expect(balanceColumns(4, 8)).toBe(4)
    expect(balanceColumns(3, 2)).toBe(3)
    expect(balanceColumns(6, 31)).toBe(6)
  })
  it('avoids a last row of one or two', () => {
    expect(balanceColumns(4, 6, 4)).toBe(3)
    expect(balanceColumns(3, 4, 4)).toBe(4)
    expect(balanceColumns(3, 4, 3)).toBe(2)
    expect(balanceColumns(6, 8, 6)).toBe(4)
  })
  it('leaves a longer last row alone', () => {
    expect(balanceColumns(4, 7)).toBe(4)
  })
})
