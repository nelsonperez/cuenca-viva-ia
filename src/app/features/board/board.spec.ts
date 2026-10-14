import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Board } from './board'

const playButton = (element: HTMLElement) =>
  Array.from(element.querySelectorAll('button')).find((b) => /Simular año|Cerrar partida/.test(b.textContent!))!

describe('Board', () => {
  it('[tablero#1] puts every part of the board on one screen', async () => {
    const { text } = await render(Board)
    for (const title of ['Mapa conceptual de la cuenca', 'Acuífero subterráneo', 'Reparto del agua', 'Tecnologías de ahorro', 'Hidro']) {
      expect(text()).toContain(title)
    }
    expect(text()).toContain('Sigue: año de sequía')
  })

  it('[bienvenida#5] marks the zones the guide points at', async () => {
    const { element } = await render(Board)
    const zones = Array.from(element.querySelectorAll('[data-guide]')).map((z) => z.getAttribute('data-guide'))
    expect(zones.sort()).toEqual(['allocation', 'play', 'river', 'stress', 'technologies'])
  })

  it('[tablero#5] the play button simulates the year', async () => {
    const { element, store, settle } = await render(Board)
    playButton(element).click()
    await settle()
    expect(store.currentYear()).toBe(1)
    expect(element.textContent).toContain('Sigue: sequía extrema')
  })

  it('[tablero#6] on the last year the button closes the game', async () => {
    const { element, text, simulate } = await render(Board)
    await simulate(4)
    expect(playButton(element).textContent).toContain('Cerrar partida')
    expect(text()).toContain('Último año de la partida')
  })
})
