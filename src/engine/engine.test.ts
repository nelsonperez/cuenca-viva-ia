import { describe, expect, it } from 'vitest'
import {
  balanceError,
  demandWith,
  initialState,
  playGame,
  purchase,
  step,
  stressBand,
  summarize,
} from './engine'
import type { Strategy } from './engine'
import { DEFAULT_PARAMS as P, DEFAULT_SCENARIO as SC } from './params'
import { SECTORS, TECHNOLOGIES } from './types'
import type { BasinState, Decision, Owned, PerSector, Technology } from './types'

const scale = (demand: PerSector, agr: number, mun: number, min: number): PerSector => ({
  agr: demand.agr * agr,
  mun: demand.mun * mun,
  min: demand.min * min,
})

const NONE: Owned = { drip: false, leaks: false, recirc: false }

/** Buys the first technology in the list that is still missing, once affordable. */
const nextPurchase = (state: BasinState, order: Technology[]): Technology[] => {
  const next = order.find((technology) => !state.owned[technology])
  return next && P.technologies[next].cost <= state.credits ? [next] : []
}

const strategy =
  (order: Technology[], agr: number, mun: number, min: number): Strategy =>
  (state) => {
    const buy = nextPurchase(state, order)
    const owned = purchase(state, buy, P).owned
    return { requested: scale(demandWith(owned, P), agr, mun, min), buy }
  }

// Reference strategies from the model draft v0.2.
const deliverAll = strategy([], 1, 1, 1)
const deliverAllWithTech = strategy(['drip', 'recirc', 'leaks'], 1, 1, 1)
const prudentWithTech = strategy(['drip', 'recirc', 'leaks'], 0.85, 1, 0.85)

const full: Decision = { requested: P.demand, buy: [] }
const year = (inflow: number) => ({ years: [{ type: 'normal' as const, inflow }] })

describe('reference strategies', () => {
  it('deliver everything, no technology', () => {
    const { history } = playGame(deliverAll, P, SC)
    const summary = summarize(history)
    expect(history.map((r) => +r.groundAfter.toFixed(2))).toEqual([109, 78, 36.55, 51.55, 20.55])
    expect(history.map((r) => r.pumping)).toEqual([0, 40, 50, 0, 40])
    expect(history.map((r) => +r.stress.toFixed(2))).toEqual([1, 1.67, 2.11, 0.83, 1.67])
    expect(summary.totalPumping).toBe(130)
    expect(summary.worstCoverage).toBeCloseTo(0.95, 6)
    expect(summary.groundChange).toBeCloseTo(-79.45, 6)
  })

  it('deliver everything, buying technology as credits allow', () => {
    const { history } = playGame(deliverAllWithTech, P, SC)
    const summary = summarize(history)
    expect(history.map((r) => r.purchased)).toEqual([[], ['drip'], [], ['recirc'], ['leaks']])
    expect(history.map((r) => +r.groundAfter.toFixed(2))).toEqual([
      109, 91.95, 59.9, 76.85, 73.8,
    ])
    expect(summary.worstCoverage).toBeCloseTo(1, 6)
    expect(summary.owned).toEqual({ drip: true, leaks: true, recirc: true })
  })

  it('prudent deliveries with technology keep the aquifer highest', () => {
    const all = summarize(playGame(deliverAll, P, SC).history)
    const tech = summarize(playGame(deliverAllWithTech, P, SC).history)
    const prudent = summarize(playGame(prudentWithTech, P, SC).history)
    expect(tech.finalGround).toBeGreaterThan(all.finalGround)
    expect(prudent.finalGround).toBeGreaterThan(tech.finalGround)
    expect(prudent.totalPumping).toBeLessThan(tech.totalPumping)
    expect(prudent.finalGround).toBeCloseTo(98.405, 3)
    expect(prudent.totalPumping).toBeCloseTo(36.8, 6)
    expect(tech.totalPumping).toBeCloseTo(58, 6)
    expect(prudent.worstCoverage).toBeCloseTo(0.85, 6)
    expect(prudent.meanCoverage.mun).toBeCloseTo(1, 6)
  })

  it('technology lowers stress under the same coverage', () => {
    const { history } = playGame(deliverAllWithTech, P, SC)
    expect(history[0].stress).toBe(history[0].stressWithoutTechnology)
    for (const result of history.slice(1)) {
      expect(result.stress).toBeLessThan(result.stressWithoutTechnology)
    }
    // Year 2, drip installed: 79 of 60 instead of 100 of 60.
    expect(history[1].stress).toBeCloseTo(79 / 60)
    expect(history[1].stressWithoutTechnology).toBeCloseTo(100 / 60)
  })
})

describe('water balance', () => {
  // Deterministic generator so failures are reproducible.
  const random = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  it('holds for random strategies and keeps the aquifer within its limits', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const next = random(seed)
      const randomStrategy: Strategy = () => ({
        // Requests above demand and below zero exercise the clamping.
        requested: scale(P.demand, next() * 1.4 - 0.2, next() * 1.4 - 0.2, next() * 1.4 - 0.2),
        buy: TECHNOLOGIES.filter(() => next() < 0.3),
      })
      const scenario = {
        years: SC.years.map((y) => ({ ...y, inflow: next() * 250 })),
      }
      for (const result of playGame(randomStrategy, P, scenario).history) {
        expect(Math.abs(balanceError(result))).toBeLessThan(1e-9)
        expect(result.groundAfter).toBeGreaterThanOrEqual(0)
        expect(result.groundAfter).toBeLessThanOrEqual(P.groundMax + 1e-9)
        expect(result.riverFlow).toBeGreaterThanOrEqual(0)
        expect(result.creditsAfter).toBeGreaterThanOrEqual(0)
        for (const sector of SECTORS) {
          expect(result.delivered[sector]).toBeGreaterThanOrEqual(0)
          expect(result.delivered[sector]).toBeLessThanOrEqual(result.demand[sector] + 1e-9)
        }
      }
    }
  })
})

describe('year rules', () => {
  it('uses river water first and returns part of irrigation to the aquifer', () => {
    const { result } = step(initialState(P), full, P, SC)
    expect(result.riverUse).toBe(100)
    expect(result.pumping).toBe(0)
    expect(result.riverFlow).toBe(0)
    expect(result.irrigationReturn).toBeCloseTo(9)
    expect(result.groundAfter).toBeCloseTo(109)
  })

  it('recharges the aquifer with part of the water left in the river', () => {
    const half: Decision = { requested: scale(P.demand, 0.5, 0.5, 0.5), buy: [] }
    const { result } = step(initialState(P), half, P, SC)
    expect(result.riverFlow).toBe(50)
    expect(result.riverRecharge).toBeCloseTo(15)
    expect(result.outflow).toBeCloseTo(35)
    expect(result.rules).toContain('riverRecharge')
  })

  it('pumps only what the river cannot cover', () => {
    const { result } = step(initialState(P), full, P, year(70))
    expect(result.riverUse).toBe(70)
    expect(result.pumping).toBe(30)
    expect(result.rules).toContain('pumping')
    expect(result.rules).not.toContain('proportionalCut')
  })

  it('cuts every sector by the same share when the pump cap is reached', () => {
    const { result } = step(initialState(P), full, P, year(40))
    expect(result.pumping).toBe(P.pumpMax)
    expect(result.rules).toEqual(
      expect.arrayContaining(['pumping', 'proportionalCut', 'pumpCapReached']),
    )
    for (const sector of SECTORS) expect(result.coverage[sector]).toBeCloseTo(0.9)
  })

  it('cannot pump more than the aquifer holds', () => {
    const state = { ...initialState(P), ground: 5 }
    const { result } = step(state, full, P, year(40))
    expect(result.pumping).toBe(5)
    expect(result.rules).toContain('aquiferExhausted')
    expect(result.groundAfter).toBeGreaterThanOrEqual(0)
  })

  it('loses what the aquifer cannot hold', () => {
    const idle: Decision = { requested: { agr: 0, mun: 0, min: 0 }, buy: [] }
    const state = { ...initialState(P), ground: P.groundMax - 10 }
    const { result } = step(state, idle, P, SC)
    expect(result.groundAfter).toBe(P.groundMax)
    expect(result.rules).toContain('groundSpill')
    expect(result.stress).toBe(0)
  })

  it('clamps requests to the sector demand', () => {
    const greedy: Decision = { requested: { agr: 500, mun: -3, min: 15 }, buy: [] }
    const { result } = step(initialState(P), greedy, P, SC)
    expect(result.requested).toEqual({ agr: 60, mun: 0, min: 15 })
  })

  it('refuses to play past the last year', () => {
    const { finalState } = playGame(deliverAll, P, SC)
    expect(() => step(finalState, full, P, SC)).toThrow()
  })
})

describe('technologies and credits', () => {
  const rich = { ...initialState(P), credits: 9 }

  it('each technology lowers the demand of its own sector', () => {
    expect(demandWith(NONE, P)).toEqual({ agr: 60, mun: 25, min: 15 })
    expect(demandWith({ ...NONE, drip: true }, P).agr).toBeCloseTo(39)
    expect(demandWith({ ...NONE, leaks: true }, P).mun).toBeCloseTo(20)
    expect(demandWith({ ...NONE, recirc: true }, P).min).toBeCloseTo(6)
  })

  it('takes effect the year it is bought and stays installed', () => {
    const first = step(rich, { requested: P.demand, buy: ['drip'] }, P, SC)
    expect(first.result.demand.agr).toBeCloseTo(39)
    expect(first.result.purchased).toEqual(['drip'])
    expect(first.result.rules).toContain('technologyPurchased')
    const second = step(first.state, full, P, SC)
    expect(second.result.demand.agr).toBeCloseTo(39)
    expect(second.result.purchased).toEqual([])
  })

  it('drip irrigation also reduces what returns to the aquifer', () => {
    const { result } = step(rich, { requested: P.demand, buy: ['drip'] }, P, SC)
    expect(result.irrigationReturn).toBeCloseTo(39 * P.irrigationReturnDrip)
    expect(result.rules).toContain('dripReducesReturn')
  })

  it('ignores purchases that are unaffordable or already owned', () => {
    const start = initialState(P)
    expect(purchase(start, ['drip'], P).purchased).toEqual([])
    expect(purchase(start, ['drip', 'leaks'], P).purchased).toEqual(['leaks'])
    expect(purchase(rich, ['leaks', 'leaks'], P)).toMatchObject({
      purchased: ['leaks'],
      credits: 7,
    })
  })

  it('carries unspent credits over and adds the yearly income', () => {
    const first = step(initialState(P), full, P, SC)
    expect(first.result.creditsAfter).toBe(P.creditsInitial + P.creditsPerYear)
    const second = step(first.state, { requested: P.demand, buy: ['drip'] }, P, SC)
    expect(second.result.creditsAfter).toBe(P.creditsPerYear)
  })
})

describe('stress bands', () => {
  it('classifies stress', () => {
    expect(stressBand(0.79)).toBe('low')
    expect(stressBand(0.8)).toBe('moderate')
    expect(stressBand(1)).toBe('high')
    expect(stressBand(1.2)).toBe('critical')
  })
})
