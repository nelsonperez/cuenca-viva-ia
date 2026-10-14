import { describe, expect, it } from '@jest/globals'
import { ungroundedNumbers } from '../../../tutor/explain'
import { render } from '../../testing/render'
import { HowToPlay } from './how-to-play'

const button = (element: HTMLElement, label: string) =>
  Array.from(element.querySelectorAll('button')).find((b) => b.textContent!.trim().includes(label))
const title = (element: HTMLElement) => element.querySelector('h2')!.textContent!.trim()

describe('HowToPlay', () => {
  it('[bienvenida#3] shows five cards in order, each with an icon', async () => {
    const { element, settle } = await render(HowToPlay)
    const titles = [title(element)]
    for (let i = 0; i < 4; i++) {
      button(element, 'Siguiente')!.click()
      await settle()
      titles.push(title(element))
      expect(element.querySelector('[data-card] app-icon')).not.toBeNull()
    }
    expect(titles).toEqual([
      'El río trae el agua',
      'Repartila',
      'Cuidá el acuífero',
      'Invertí en tecnología',
      'Simulá y aprendé',
    ])
    expect(button(element, 'Siguiente')).toBeUndefined()
  })

  it('[bienvenida#4] moves with the arrow keys and shows where you are', async () => {
    const { element, settle } = await render(HowToPlay)
    expect(element.querySelector('[aria-current="step"]')!.getAttribute('aria-label')).toBe('Tarjeta 1 de 5')
    element.querySelector('section')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await settle()
    expect(title(element)).toBe('Repartila')
    expect(element.querySelector('[aria-current="step"]')!.getAttribute('aria-label')).toBe('Tarjeta 2 de 5')
    element.querySelector('section')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await settle()
    expect(title(element)).toBe('El río trae el agua')
    expect(button(element, 'Anterior')!.disabled).toBe(true)
  })

  it('[bienvenida#4] can be skipped from any card, or closed back to the welcome', async () => {
    const { element, store } = await render(HowToPlay)
    button(element, 'Saltear')!.click()
    expect(store.screen()).toBe('playing')
    store.showHowTo()
    button(element, 'Volver')!.click()
    expect(store.screen()).toBe('welcome')
  })

  it('[bienvenida#4] the last card starts the game', async () => {
    const { element, store, settle } = await render(HowToPlay)
    for (let i = 0; i < 4; i++) {
      button(element, 'Siguiente')!.click()
      await settle()
    }
    button(element, '¡A jugar!')!.click()
    expect(store.screen()).toBe('playing')
  })

  it('[bienvenida#16] the cards write no numbers', async () => {
    const { element, text, settle } = await render(HowToPlay)
    for (let i = 0; i < 5; i++) {
      expect(ungroundedNumbers(element.querySelector('[data-card]')!.textContent!, {})).toEqual([])
      button(element, 'Siguiente')?.click()
      await settle()
    }
    expect(text()).toContain('Simulá y aprendé')
  })
})
