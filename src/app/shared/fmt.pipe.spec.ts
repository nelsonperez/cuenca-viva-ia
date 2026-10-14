import { describe, expect, it } from '@jest/globals'
import { FmtPipe } from './fmt.pipe'

describe('FmtPipe', () => {
  it('[constitución 5.8] formats numbers like the tutor', () => {
    const pipe = new FmtPipe()
    expect(pipe.transform(36.55)).toBe('36,5')
    expect(pipe.transform(1.3166, 2)).toBe('1,32')
    expect(pipe.transform(54.6, 0)).toBe('55')
  })
})
