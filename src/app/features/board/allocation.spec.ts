import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Allocation } from './allocation'

describe('Allocation', () => {
  it('[tablero#9] has a native, labelled range control per sector', async () => {
    const { element } = await render(Allocation)
    const sliders = Array.from(element.querySelectorAll<HTMLInputElement>('input[type="range"]'))
    expect(sliders.map((slider) => slider.id)).toEqual(['coverage-agr', 'coverage-mun', 'coverage-min'])
    for (const slider of sliders) {
      expect(element.querySelector(`label[for="${slider.id}"]`)).not.toBeNull()
      expect(slider.value).toBe('100')
    }
  })

  it('[tablero#2] moving a control updates the request and the stress at once', async () => {
    const { element, text, store, settle } = await render(Allocation)
    expect(text()).toContain('Pedido: 100 UE · Río: 100 UE')
    expect(text()).toContain('1 · Alto')

    const agr = element.querySelector<HTMLInputElement>('#coverage-agr')!
    agr.value = '50'
    agr.dispatchEvent(new Event('input'))
    await settle()

    expect(store.game().draft.coverage.agr).toBe(50)
    expect(text()).toContain('Pedido: 70 UE · Río: 100 UE')
    expect(text()).toContain('0,7 · Bajo')
    expect(text()).toContain('50%')
  })

  it('[tablero#2] tells how much comes out of the aquifer', async () => {
    const { text, simulate } = await render(Allocation)
    await simulate()
    expect(text()).toContain('Se usan 100 UE; el río trae 60 (40 salen del acuífero)')
    expect(text()).toContain('Crítico')
  })
})
