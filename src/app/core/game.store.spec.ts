import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { DEFAULT_PARAMS as P, DEFAULT_SCENARIO as SC } from '../../engine/params'
import { GameStore } from './game.store'
import { SCENARIO } from './game.tokens'

describe('GameStore', () => {
  let store: GameStore

  beforeEach(() => {
    store = TestBed.inject(GameStore)
  })

  const simulateAll = () => {
    for (let i = 0; i < SC.years.length; i++) store.dispatch({ type: 'simulate' })
  }

  it('[tablero#1] starts in year 1 with the initial aquifer and credits', () => {
    expect(store.currentYear()).toBe(0)
    expect(store.totalYears).toBe(SC.years.length)
    expect(store.preview()?.inflow).toBe(SC.years[0].inflow)
    expect(store.preview()?.groundBefore).toBe(P.groundInitial)
    expect(store.creditsLeft()).toBe(P.creditsInitial)
    expect(store.nextYearType()).toBe(SC.years[1].type)
  })

  it('[tablero#2] moving a coverage control recomputes the preview without advancing', () => {
    const before = store.preview()!
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    const after = store.preview()!
    expect(after.stress).toBeLessThan(before.stress)
    expect(after.riverFlow).toBeGreaterThan(before.riverFlow)
    expect(store.game().draft.coverage.agr).toBe(50)
    expect(store.game().basin.year).toBe(0)
  })

  it('[tablero#2] exposes the facts of the preview: total requested and total recharge', () => {
    const facts = store.facts()!
    const preview = store.preview()!
    expect(facts['totalRequested']).toBe(preview.requested.agr + preview.requested.mun + preview.requested.min)
    expect(facts['totalRecharge']).toBe(preview.riverRecharge + preview.irrigationReturn)
  })

  it('[tablero#3] an affordable technology lowers the need and the stress, and spends credits', () => {
    store.dispatch({ type: 'toggleBuy', technology: 'leaks' })
    const preview = store.preview()!
    expect(preview.demand.mun).toBeLessThan(P.demand.mun)
    expect(preview.stress).toBeLessThan(preview.stressWithoutTechnology)
    expect(store.creditsLeft()).toBe(P.creditsInitial - P.technologies.leaks.cost)
  })

  it('[tablero#4] reports each technology as buyable, selected, locked or owned', () => {
    const status = () => Object.fromEntries(store.technologies().map((t) => [t.technology, t.status]))
    expect(status()).toEqual({ drip: 'locked', leaks: 'available', recirc: 'locked' })

    store.dispatch({ type: 'toggleBuy', technology: 'leaks' })
    expect(status()).toEqual({ drip: 'locked', leaks: 'selected', recirc: 'locked' })

    store.dispatch({ type: 'simulate' })
    expect(status()['leaks']).toBe('owned')
  })

  it('[tablero#5] simulating advances the year and keeps what happened', () => {
    store.dispatch({ type: 'simulate' })
    expect(store.currentYear()).toBe(1)
    expect(store.lastYear()?.year).toBe(0)
    expect(store.preview()?.yearType).toBe(SC.years[1].type)
  })

  it('[tablero#6] after the last year there is no preview and the game is finished', () => {
    simulateAll()
    expect(store.preview()).toBeNull()
    expect(store.facts()).toBeNull()
    expect(store.isLastYear()).toBe(false)
    expect(store.currentYear()).toBe(SC.years.length - 1)
    expect(store.game().finished).toHaveLength(1)
  })

  it('[tablero#6] restarting starts again from the same conditions', () => {
    simulateAll()
    store.dispatch({ type: 'restart' })
    expect(store.currentYear()).toBe(0)
    expect(store.preview()?.groundBefore).toBe(P.groundInitial)
    expect(store.game().finished).toHaveLength(1)
  })

  it('[tablero#7] keeps the last two finished games to compare them', () => {
    simulateAll()
    store.dispatch({ type: 'restart' })
    simulateAll()
    expect(store.game().finished).toHaveLength(2)
  })
})

describe('GameStore with another scenario', () => {
  it('uses the injected scenario', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: SCENARIO, useValue: { years: [{ type: 'wet', inflow: 120 }] } }],
    })
    const store = TestBed.inject(GameStore)
    expect(store.totalYears).toBe(1)
    expect(store.isLastYear()).toBe(true)
    expect(store.nextYearType()).toBeNull()
    expect(store.preview()?.inflow).toBe(120)
  })
})
