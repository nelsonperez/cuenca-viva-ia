import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Aquifer } from './aquifer'

describe('Aquifer', () => {
  it('[tablero#1] shows the aquifer level', async () => {
    const { element, text } = await render(Aquifer)
    expect(text()).toContain('100 UE')
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
})
