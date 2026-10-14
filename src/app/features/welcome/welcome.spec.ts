import { describe, expect, it } from '@jest/globals'
import { GOALS } from '../../../engine/params'
import { ungroundedNumbers } from '../../../tutor/explain'
import { render } from '../../testing/render'
import { Welcome } from './welcome'

const button = (element: HTMLElement, label: string) =>
  Array.from(element.querySelectorAll('button')).find((b) => b.textContent!.includes(label))!

describe('Welcome', () => {
  it('[bienvenida#1] presents the role, the mission with its three medals and Hidro', async () => {
    const { element, text } = await render(Welcome)
    expect(text()).toContain('Sos quien reparte el agua de la cuenca durante 5 años')
    expect(text()).toContain('¡Hola! Soy Hidro.')
    for (const medal of ['Acuífero a salvo', 'Nadie sin agua', 'Cuenca en calma']) expect(text()).toContain(medal)
    expect(text()).toContain('al menos 90 %')
    expect(element.querySelectorAll('app-medal')).toHaveLength(3)
  })

  it('[bienvenida#2] "Nueva partida" starts the game', async () => {
    const { element, store } = await render(Welcome)
    button(element, 'Nueva partida').click()
    expect(store.screen()).toBe('playing')
  })

  it('[bienvenida#3] "Cómo se juega" opens the instructions', async () => {
    const { element, store } = await render(Welcome)
    button(element, 'Cómo se juega').click()
    expect(store.screen()).toBe('howTo')
  })

  it('[bienvenida#16] every number comes from the scenario or the goals', async () => {
    const { text, store } = await render(Welcome)
    const known = {
      years: store.totalYears,
      aquiferSafe: GOALS.aquiferSafe * 100,
      noOneWithout: GOALS.noOneWithout * 100,
      calmBasin: GOALS.calmBasin,
    }
    expect(ungroundedNumbers(text(), known)).toEqual([])
  })
})
