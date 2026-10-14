import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Technologies } from './technologies'

const card = (element: HTMLElement, title: string) =>
  Array.from(element.querySelectorAll('button')).find((b) => b.textContent!.includes(title))!

describe('Technologies', () => {
  it('[tablero#4] locks what the credits cannot pay', async () => {
    const { element, text } = await render(Technologies)
    expect(text()).toContain('Créditos: 2')
    expect(card(element, 'Riego por goteo').disabled).toBe(true)
    expect(card(element, 'Riego por goteo').textContent).toContain('Créditos insuficientes')
    expect(card(element, 'Reparar fugas').disabled).toBe(false)
    expect(text()).toContain('Todavía no hay tecnologías que bajen el estrés este año.')
  })

  it('[tablero#3] selecting a technology lowers the stress and shows by how much', async () => {
    const { element, text, settle } = await render(Technologies)
    card(element, 'Reparar fugas').click()
    await settle()
    expect(card(element, 'Reparar fugas').getAttribute('aria-pressed')).toBe('true')
    expect(card(element, 'Reparar fugas').textContent).toContain('Se instala este año')
    expect(text()).toContain('Créditos: 0')
    expect(text()).toContain('Con las tecnologías el estrés baja de 1 a 0,95.')
  })

  it('[tablero#4] an installed technology cannot be bought again', async () => {
    const { element, store, simulate } = await render(Technologies)
    store.dispatch({ type: 'toggleBuy', technology: 'leaks' })
    await simulate()
    expect(card(element, 'Reparar fugas').disabled).toBe(true)
    expect(card(element, 'Reparar fugas').textContent).toContain('Instalada')
  })
})
