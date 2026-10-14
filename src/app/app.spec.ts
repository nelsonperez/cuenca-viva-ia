import { describe, expect, it } from '@jest/globals'
import { render } from './testing/render'
import { App } from './app'

describe('App', () => {
  it('[bienvenida#1] opens on the welcome screen', async () => {
    const { element } = await render(App)
    expect(element.querySelector('h1')?.textContent).toContain('Cuenca Viva IA')
    expect(element.querySelector('app-welcome')).not.toBeNull()
    expect(element.querySelector('app-board')).toBeNull()
  })

  it('[bienvenida#3] shows how to play', async () => {
    const { element, store, settle } = await render(App)
    store.showHowTo()
    await settle()
    expect(element.querySelector('app-how-to-play')).not.toBeNull()
  })

  it('[tablero#1] [bienvenida#2] "Nueva partida" opens the board of year 1, with the guide', async () => {
    const { element, text, store, settle } = await render(App)
    store.start()
    await settle()
    expect(text()).toContain('Año 1 de 5')
    expect(element.querySelector('app-board')).not.toBeNull()
    expect(element.querySelector('app-guide-overlay')).not.toBeNull()
  })

  it('[tablero#6] shows the summary when the game ends, and the board again after restarting', async () => {
    const { element, store, settle, simulate } = await render(App)
    store.start()
    await simulate(5)
    expect(element.querySelector('app-board')).toBeNull()
    expect(element.querySelector('app-summary')).not.toBeNull()
    store.dispatch({ type: 'restart' })
    await settle()
    expect(element.querySelector('app-board')).not.toBeNull()
  })

  it('[constitución 1.3] always shows that the data is simulated, with the legal note', async () => {
    const { text, store, settle, simulate } = await render(App)
    const moments: [string, () => Promise<void>][] = [
      ['welcome', async () => store.showHowTo()],
      ['howTo', async () => store.start()],
      ['board', async () => simulate(5)],
      ['summary', async () => undefined],
    ]
    for (const [moment, next] of moments) {
      await settle()
      expect([moment, text().includes('Datos simulados · Uso educativo')]).toEqual([moment, true])
      expect([moment, text().includes('No representa mediciones reales')]).toEqual([moment, true])
      await next()
    }
  })
})
