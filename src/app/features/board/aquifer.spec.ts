import { describe, expect, it } from '@jest/globals'
import { DEFAULT_PARAMS } from '../../../engine/params'
import { PARAMS } from '../../core/game.tokens'
import { render } from '../../testing/render'
import { Aquifer } from './aquifer'

describe('Aquifer', () => {
  it('[tablero#1] shows the aquifer level', async () => {
    const { element, text } = await render(Aquifer)
    expect(text()).toContain('100 de 200 UE')
    expect(text()).toContain('50%')
    expect(element.querySelector('[role="img"]')!.getAttribute('aria-label')).toBe(
      'Nivel del acuífero: 50 por ciento de su capacidad',
    )
  })

  it('[tablero#2] projects the aquifer at the end of the year, with recharge and pumping', async () => {
    const { text, simulate } = await render(Aquifer)
    expect(text()).toContain('Al cierre del año: 109 UE (+9)')
    await simulate()
    expect(text()).toContain('Al cierre del año: 78 UE (−31)')
    expect(text()).toContain('+9')
    expect(text()).toContain('−40')
  })

  it('[tablero#11] says what the percentage is of: how much it holds out of how much it can hold', async () => {
    const { text } = await render(Aquifer)
    expect(text()).toContain('100 de 200 UE')
    expect(text()).toContain('50 % de su capacidad')
  })

  it('[tablero#11] writes zero amounts with no sign', async () => {
    const { element } = await render(Aquifer)
    const flows = Array.from(element.querySelectorAll('[data-flow]')).map((f) => f.textContent!.trim())
    expect(flows).toEqual(['+9', '0'])
  })

  it('[tablero#11] keeps the tank percentage away from the projection line', async () => {
    const low = await render(Aquifer)
    // Year 1 projects 109 of 200 UE: the line is low, the number goes on top.
    expect(low.element.querySelector('[data-level-label]')!.getAttribute('data-level-label')).toBe('top')
  })

  it('[tablero#11] moves the percentage down when the projection is high', async () => {
    const high = await render(Aquifer, [{ provide: PARAMS, useValue: { ...DEFAULT_PARAMS, groundInitial: 160 } }])
    expect(high.text()).toContain('160 de 200 UE')
    expect(high.element.querySelector('[data-level-label]')!.getAttribute('data-level-label')).toBe('bottom')
  })
})
