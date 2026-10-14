import { describe, expect, it } from '@jest/globals'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { facts, ungroundedNumbers } from '../../../tutor/explain'
import { GameStore } from '../../core/game.store'
import { GuideOverlay } from './guide-overlay'

/** A stand-in for the board: one element per zone the guide points at. */
@Component({
  imports: [GuideOverlay],
  template: `
    <div data-guide="river">Río</div>
    <div data-guide="allocation"><input id="slider" type="range" /></div>
    <div data-guide="stress">Estrés</div>
    <div data-guide="stress">Acuífero</div>
    <div data-guide="technologies"><button type="button">Comprar</button></div>
    <button data-guide="play" type="button">Simular año</button>
    <app-guide-overlay />
  `,
})
class Host {}

const setup = async () => {
  const fixture = TestBed.createComponent(Host)
  const store = TestBed.inject(GameStore)
  store.start()
  await fixture.whenStable()
  const element = fixture.nativeElement as HTMLElement
  const bubble = () => element.querySelector('app-guide-overlay [aria-live="polite"]')?.textContent ?? ''
  const button = (label: string) =>
    Array.from(element.querySelectorAll('app-guide-overlay button')).find((b) => b.textContent!.includes(label)) as
      | HTMLButtonElement
      | undefined
  const target = () => element.querySelector('.guide-target')?.getAttribute('data-guide')
  return { fixture, store, element, bubble, button, target, settle: () => fixture.whenStable() }
}

describe('GuideOverlay', () => {
  it('[bienvenida#5] points at the river first, with the water of the year', async () => {
    const { bubble, target, element } = await setup()
    expect(target()).toBe('river')
    expect(bubble()).toContain('Este año el río trae 100 UE')
    expect(element.textContent).toContain('Paso 1 de 5')
  })

  it('[bienvenida#6] [bienvenida#8] waits for a slider move, with the focus on the slider', async () => {
    const { store, button, target, element, settle } = await setup()
    button('Entendido')!.click()
    await settle()
    expect(target()).toBe('allocation')
    expect(document.activeElement).toBe(element.querySelector('#slider'))
    expect(button('Entendido')).toBeUndefined()
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 90 })
    await settle()
    expect(target()).toBe('stress')
    expect(element.querySelectorAll('.guide-target')).toHaveLength(2)
    expect(document.activeElement!.textContent).toContain('Entendido')
  })

  it('[bienvenida#5] goes through the five zones and ends when the year is simulated', async () => {
    const { store, button, target, element, settle } = await setup()
    const zones = [target()]
    button('Entendido')!.click()
    await settle()
    zones.push(target())
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 90 })
    await settle()
    zones.push(target())
    button('Entendido')!.click()
    await settle()
    zones.push(target())
    button('Entendido')!.click()
    await settle()
    zones.push(target())
    expect(zones).toEqual(['river', 'allocation', 'stress', 'technologies', 'play'])
    store.dispatch({ type: 'simulate' })
    await settle()
    expect(target()).toBeUndefined()
    expect(element.querySelector('app-guide-overlay [aria-live]')).toBeNull()
  })

  it('[bienvenida#7] "Saltear guía" closes it', async () => {
    const { store, button, target, settle } = await setup()
    button('Saltear guía')!.click()
    await settle()
    expect(store.guideStep()).toBeNull()
    expect(target()).toBeUndefined()
  })

  it('[bienvenida#7] Esc closes it', async () => {
    const { store, settle } = await setup()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await settle()
    expect(store.guideStep()).toBeNull()
  })

  it('[bienvenida#16] what Hidro says only uses numbers from the engine', async () => {
    const { store, bubble, button, settle } = await setup()
    const known = { ...facts(store.preview()!), credits: store.creditsLeft() }
    for (let step = 0; step < 5; step++) {
      expect(ungroundedNumbers(bubble(), known)).toEqual([])
      if (button('Entendido')) button('Entendido')!.click()
      else store.dispatch({ type: 'setCoverage', sector: 'agr', value: 100 })
      await settle()
    }
  })
})
