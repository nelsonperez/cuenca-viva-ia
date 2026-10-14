import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Header } from './header'

describe('Header', () => {
  it('[tablero#1] shows the year, its type, the progress and the simulated-data notice', async () => {
    const { element, text } = await render(Header)
    expect(text()).toContain('Año 1 de 5 · Año normal')
    expect(text()).toContain('Datos simulados · Uso educativo')
    const steps = Array.from(element.querySelectorAll('[data-step]'))
    expect(steps.map((step) => step.getAttribute('data-step'))).toEqual(['now', 'next', 'next', 'next', 'next'])
  })

  it('[tablero#5] advances with the game', async () => {
    const { element, text, simulate } = await render(Header)
    await simulate()
    expect(text()).toContain('Año 2 de 5 · Año de sequía')
    expect(element.querySelector('[data-step]')!.getAttribute('data-step')).toBe('done')
  })

  it('[tablero#6] says when the game is over', async () => {
    const { text, simulate } = await render(Header)
    await simulate(5)
    expect(text()).toContain('Partida terminada')
  })
})
