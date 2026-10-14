import { describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { Icon } from './icon'

const draw = async (name: string, size?: number) => {
  const fixture = TestBed.createComponent(Icon)
  fixture.componentRef.setInput('name', name)
  if (size) fixture.componentRef.setInput('size', size)
  await fixture.whenStable()
  return (fixture.nativeElement as HTMLElement).querySelector('svg')!
}

describe('Icon', () => {
  it('draws a decorative outline icon at the default size', async () => {
    const svg = await draw('tutor')
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('width')).toBe('22')
    expect(svg.getAttribute('stroke')).toBe('currentColor')
    expect(svg.querySelectorAll('path').length).toBe(6)
  })

  it('draws the play icon filled and honours the size', async () => {
    const svg = await draw('play', 26)
    expect(svg.getAttribute('width')).toBe('26')
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe('currentColor')
  })
})
