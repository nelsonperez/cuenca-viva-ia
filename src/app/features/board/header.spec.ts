import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Header } from './header'

describe('Header', () => {
  it('[bienvenida#1] before playing shows only the name and the simulated-data notice', async () => {
    const { text } = await render(Header)
    expect(text()).toContain('Cuenca Viva IA')
    expect(text()).toContain('Datos simulados · Uso educativo')
    expect(text()).not.toContain('Año 1 de 5')
  })

  it('[tablero#1] shows the year, its type, the progress and the simulated-data notice', async () => {
    const { element, text, store, settle } = await render(Header)
    store.start()
    await settle()
    expect(text()).toContain('Año 1 de 5 · Año normal')
    expect(text()).toContain('Datos simulados · Uso educativo')
    const steps = Array.from(element.querySelectorAll('[data-step]'))
    expect(steps.map((step) => step.getAttribute('data-step'))).toEqual(['now', 'next', 'next', 'next', 'next'])
  })

  it('[tablero#5] advances with the game', async () => {
    const { element, text, store, simulate } = await render(Header)
    store.start()
    await simulate()
    expect(text()).toContain('Año 2 de 5 · Año de sequía')
    expect(element.querySelector('[data-step]')!.getAttribute('data-step')).toBe('done')
  })

  it('[tablero#6] says when the game is over', async () => {
    const { text, store, simulate } = await render(Header)
    store.start()
    await simulate(5)
    expect(text()).toContain('Partida terminada')
  })

  it('[bienvenida#14] shows the mission with each medal on track or at risk', async () => {
    const { element, store, settle } = await render(Header)
    store.start()
    store.skipGuide()
    await settle()
    const states = () => Array.from(element.querySelectorAll('app-medal [data-state]')).map((m) => m.getAttribute('data-state'))
    expect(states()).toEqual(['onTrack', 'onTrack', 'onTrack'])
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    await settle()
    expect(states()).toEqual(['onTrack', 'atRisk', 'onTrack'])
  })
})
