import { describe, expect, it } from '@jest/globals'
import { render } from './testing/render'
import { App } from './app'

describe('App', () => {
  it('[tablero#1] opens on the board of year 1', async () => {
    const { element, text } = await render(App)
    expect(element.querySelector('h1')?.textContent).toContain('Cuenca Viva IA')
    expect(text()).toContain('Año 1 de 5')
    expect(element.querySelector('app-board')).not.toBeNull()
    expect(element.querySelector('app-summary')).toBeNull()
  })

  it('[tablero#6] shows the summary when the game ends, and the board again after restarting', async () => {
    const { element, store, settle, simulate } = await render(App)
    await simulate(5)
    expect(element.querySelector('app-board')).toBeNull()
    expect(element.querySelector('app-summary')).not.toBeNull()
    store.dispatch({ type: 'restart' })
    await settle()
    expect(element.querySelector('app-board')).not.toBeNull()
  })

  it('[constitución 1.3] always shows that the data is simulated, with the legal note', async () => {
    const { text, simulate } = await render(App)
    for (const moment of ['board', 'summary']) {
      expect([moment, text().includes('Datos simulados · Uso educativo')]).toEqual([moment, true])
      expect([moment, text().includes('No representa mediciones reales')]).toEqual([moment, true])
      await simulate(5)
    }
  })
})
