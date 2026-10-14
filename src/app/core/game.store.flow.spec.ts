import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { DEFAULT_SCENARIO as SC } from '../../engine/params'
import { GameStore } from './game.store'
import { GUIDE_STEPS } from './guide'

describe('GameStore screens and guide', () => {
  let store: GameStore

  beforeEach(() => {
    store = TestBed.inject(GameStore)
  })

  const simulateAll = () => {
    for (let i = 0; i < SC.years.length; i++) store.dispatch({ type: 'simulate' })
  }
  const zone = () => (store.guideStep() === null ? null : GUIDE_STEPS[store.guideStep()!].zone)

  it('[bienvenida#1] opens on the welcome screen, with no guide', () => {
    expect(store.screen()).toBe('welcome')
    expect(store.guideStep()).toBeNull()
  })

  it('[bienvenida#3] shows how to play and starts from there', () => {
    store.showHowTo()
    expect(store.screen()).toBe('howTo')
    store.start()
    expect(store.screen()).toBe('playing')
  })

  it('[bienvenida#2] [bienvenida#5] "Nueva partida" shows year 1 and starts the guide', () => {
    store.start()
    expect(store.screen()).toBe('playing')
    expect(store.currentYear()).toBe(0)
    expect(zone()).toBe('river')
  })

  it('[bienvenida#6] acknowledged steps advance with "Entendido"; action steps wait for the action', () => {
    store.start()
    store.nextGuideStep()
    expect(zone()).toBe('allocation')

    store.nextGuideStep()
    expect(zone()).toBe('allocation')
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 90 })
    expect(zone()).toBe('stress')

    store.nextGuideStep()
    expect(zone()).toBe('technologies')
    store.nextGuideStep()
    expect(zone()).toBe('play')

    store.nextGuideStep()
    expect(zone()).toBe('play')
    store.dispatch({ type: 'simulate' })
    expect(store.guideStep()).toBeNull()
    expect(store.currentYear()).toBe(1)
  })

  it('[bienvenida#6] other actions do not move the guide, and simulating early ends it', () => {
    store.start()
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 90 })
    expect(zone()).toBe('river')
    store.dispatch({ type: 'simulate' })
    expect(store.guideStep()).toBeNull()
  })

  it('[bienvenida#7] the guide can be skipped at any step', () => {
    store.start()
    store.skipGuide()
    expect(store.guideStep()).toBeNull()
    expect(store.screen()).toBe('playing')
  })

  it('[bienvenida#9] "Jugar de nuevo" does not repeat the guide', () => {
    store.start()
    store.skipGuide()
    simulateAll()
    store.dispatch({ type: 'restart' })
    expect(store.screen()).toBe('playing')
    expect(store.guideStep()).toBeNull()
  })

  it('[bienvenida#15] "Volver al inicio" shows the welcome and keeps the finished games', () => {
    store.start()
    simulateAll()
    store.backToStart()
    expect(store.screen()).toBe('welcome')
    expect(store.game().finished).toHaveLength(1)

    store.start()
    expect(store.currentYear()).toBe(0)
    expect(store.preview()).not.toBeNull()
    expect(store.game().finished).toHaveLength(1)
    expect(store.guideStep()).toBeNull()
  })

  it('[bienvenida#14] tells which medals are on track with the drafted year', () => {
    store.start()
    const onTrack = () => store.mission()!.map((m) => m.won)
    expect(store.mission()!.map((m) => m.medal)).toEqual(['aquiferSafe', 'noOneWithout', 'calmBasin'])
    expect(onTrack()).toEqual([true, true, true])
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    expect(onTrack()[1]).toBe(false)
    simulateAll()
    expect(store.mission()).toBeNull()
  })

  it('[bienvenida#10] gives the medals of the last finished game', () => {
    expect(store.medals()).toBeNull()
    store.start()
    simulateAll()
    expect(store.medals()!.map((m) => [m.medal, m.won])).toEqual([
      ['aquiferSafe', false],
      ['noOneWithout', true],
      ['calmBasin', false],
    ])
  })
})
