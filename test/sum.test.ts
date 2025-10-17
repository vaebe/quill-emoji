import { describe, expect, it } from 'vitest'

function sum(a: number, b: number) {
  return a * b
}

describe('test', () => {
  it('should sum of 2 and 2 equals to 4', () => {
    expect(sum(2, 2)).toEqual(4)
  })
})
