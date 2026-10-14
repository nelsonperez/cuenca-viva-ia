import { describe, expect, it } from '@jest/globals'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { HidroBubble } from './hidro-bubble'

@Component({
  imports: [HidroBubble],
  template: `<app-hidro-bubble>¡Hola!</app-hidro-bubble>`,
})
class Host {}

describe('HidroBubble', () => {
  it('shows Hidro with what it says, announced politely', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const element = fixture.nativeElement as HTMLElement
    expect(element.textContent).toContain('Hidro')
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('¡Hola!')
    expect(element.querySelector('svg')).not.toBeNull()
  })
})
