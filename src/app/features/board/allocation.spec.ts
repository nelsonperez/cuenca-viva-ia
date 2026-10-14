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

  it('[tablero#10] explains that 100 % is everything a sector needs, in UE', async () => {
    const { element, text } = await render(Allocation)
    expect(text()).toContain('100 % es todo lo que necesita')
    const rows = Array.from(element.querySelectorAll('label')).map((l) => l.textContent!.replace(/\s+/g, ' ').trim())
    expect(rows).toEqual([
      'Agricultura Recibe 60 de 60 UE',
      'Ciudad Recibe 25 de 25 UE',
      'Minería Recibe 15 de 15 UE',
    ])
  })

  it('[tablero#10] lowering a slider lowers what the sector receives', async () => {
    const { element, store, settle } = await render(Allocation)
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    await settle()
    expect(element.querySelector('label[for="coverage-agr"]')!.textContent).toContain('Recibe 30 de 60 UE')
  })

  it('[tablero#10] shows the cut when the river and the pumps are not enough', async () => {
    const { element, simulate } = await render(Allocation)
    await simulate(2)
    // Extreme drought: 45 UE of river plus 50 of pumping for 100 requested.
    expect((element.querySelector('#coverage-agr') as HTMLInputElement).value).toBe('100')
    expect(element.querySelector('label[for="coverage-agr"]')!.textContent).toContain('Recibe 57 de 60 UE')
  })
})
