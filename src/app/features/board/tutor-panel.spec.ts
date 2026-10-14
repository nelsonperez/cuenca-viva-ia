import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { TutorPanel } from './tutor-panel'

describe('TutorPanel', () => {
  it('[tutor#7] announces the advice on the drafted decision', async () => {
    const { element } = await render(TutorPanel)
    const tip = element.querySelector('[aria-live="polite"]')!
    expect(tip.textContent).toContain('El río alcanza para lo que pedís')
    expect(element.querySelector('details')).toBeNull()
  })

  it('[tablero#5] explains the year that was just simulated', async () => {
    const { element, text, simulate } = await render(TutorPanel)
    await simulate()
    expect(element.querySelector('details')!.open).toBe(true)
    expect(text()).toContain('Qué pasó el año pasado')
    expect(text()).toContain('Año 1, año normal: el río trajo 100 UE de agua.')
  })
})
