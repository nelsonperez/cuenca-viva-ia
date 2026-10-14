import { describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { Medal } from './medal'

const draw = async (medal: string, state: string) => {
  const fixture = TestBed.createComponent(Medal)
  fixture.componentRef.setInput('medal', medal)
  fixture.componentRef.setInput('state', state)
  await fixture.whenStable()
  const element = fixture.nativeElement as HTMLElement
  return { element, text: element.textContent!.replace(/\s+/g, ' ').trim() }
}

describe('Medal', () => {
  it('[bienvenida#10] shows a won medal with its name', async () => {
    const { element, text } = await draw('aquiferSafe', 'won')
    expect(text).toContain('Acuífero a salvo')
    expect(element.querySelector('[data-state="won"]')).not.toBeNull()
  })

  it('[bienvenida#10] greys out a missing medal and says so to screen readers', async () => {
    const { element, text } = await draw('calmBasin', 'missing')
    expect(text).toContain('Cuenca en calma')
    expect(text).toContain('no conseguida')
    expect(element.querySelector('[data-state="missing"]')).not.toBeNull()
  })

  it('[bienvenida#14] tells whether a medal is on track or at risk', async () => {
    expect((await draw('noOneWithout', 'onTrack')).text).toContain('en camino')
    expect((await draw('noOneWithout', 'atRisk')).text).toContain('en riesgo')
  })
})
