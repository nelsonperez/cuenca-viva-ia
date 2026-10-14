import { describe, expect, it } from '@jest/globals'
import { demandWith, playGame, purchase, summarize } from '../engine/engine'
import type { Strategy } from '../engine/engine'
import { DEFAULT_PARAMS as P, DEFAULT_SCENARIO as SC, GOALS } from '../engine/params'
import { TECHNOLOGIES } from '../engine/types'
import type { BasinState, GameSummary, Technology } from '../engine/types'
import { MEDALS, medals, medalsSoFar } from './medals'

const summary = (overrides: Partial<GameSummary>): GameSummary => ({
  finalGround: P.groundInitial,
  groundChange: 0,
  totalPumping: 0,
  totalRecharge: 0,
  worstCoverage: 1,
  meanCoverage: { agr: 1, mun: 1, min: 1 },
  meanStress: 0.5,
  owned: { drip: false, leaks: false, recirc: false },
  ...overrides,
})

const won = (s: GameSummary) => medals(s, P).filter((m) => m.won).map((m) => m.medal)

describe('medals', () => {
  it('lists the three medals in a fixed order', () => {
    expect(medals(summary({}), P).map((m) => m.medal)).toEqual(MEDALS)
    expect(MEDALS).toEqual(['aquiferSafe', 'noOneWithout', 'calmBasin'])
  })

  it('[bienvenida#11] "Acuífero a salvo" needs the final aquifer at the threshold share of the initial one', () => {
    const at = P.groundInitial * GOALS.aquiferSafe
    expect(won(summary({ finalGround: at }))).toContain('aquiferSafe')
    expect(won(summary({ finalGround: at - 0.1 }))).not.toContain('aquiferSafe')
  })

  it('[bienvenida#12] "Nadie sin agua" needs every sector at the threshold coverage every year', () => {
    expect(won(summary({ worstCoverage: GOALS.noOneWithout }))).toContain('noOneWithout')
    expect(won(summary({ worstCoverage: GOALS.noOneWithout - 0.01 }))).not.toContain('noOneWithout')
  })

  it('[bienvenida#13] "Cuenca en calma" needs a mean stress below the threshold', () => {
    expect(won(summary({ meanStress: GOALS.calmBasin - 0.01 }))).toContain('calmBasin')
    expect(won(summary({ meanStress: GOALS.calmBasin }))).not.toContain('calmBasin')
  })

  it('tolerates floating-point error right at a threshold', () => {
    expect(won(summary({ worstCoverage: GOALS.noOneWithout - 1e-12 }))).toContain('noOneWithout')
  })
})

describe('medal calibration with the reference strategies', () => {
  const nextPurchase = (state: BasinState, order: Technology[]): Technology[] => {
    const next = order.find((t) => !state.owned[t])
    return next && P.technologies[next].cost <= state.credits ? [next] : []
  }
  const strategy =
    (order: Technology[], agr: number, mun: number, min: number): Strategy =>
    (state) => {
      const buy = nextPurchase(state, order)
      const demand = demandWith(purchase(state, buy, P).owned, P)
      return { requested: { agr: demand.agr * agr, mun: demand.mun * mun, min: demand.min * min }, buy }
    }
  const count = (s: Strategy) => won(summarize(playGame(s, P, SC).history)).length
  const tech: Technology[] = ['drip', 'recirc', 'leaks']

  it('delivering everything with no technology wins at most one medal', () => {
    expect(count(strategy([], 1, 1, 1))).toBeLessThanOrEqual(1)
  })

  it('prudent deliveries win at least two medals', () => {
    expect(count(strategy(tech, 0.85, 1, 0.85))).toBeGreaterThanOrEqual(2)
  })

  it('all three need prudent deliveries and technology together', () => {
    expect(count(strategy(tech, 0.85, 1, 0.85))).toBe(3)
    expect(count(strategy(tech, 1, 1, 1))).toBeLessThan(3)
    expect(count(strategy([], 0.85, 1, 0.85))).toBeLessThan(3)
  })
})

describe('medals in random games', () => {
  const random = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  it('each medal matches its condition on the summary', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const next = random(seed)
      const randomStrategy: Strategy = () => ({
        requested: { agr: next() * 60, mun: next() * 25, min: next() * 15 },
        buy: TECHNOLOGIES.filter(() => next() < 0.3),
      })
      const s = summarize(playGame(randomStrategy, P, SC).history)
      const result = Object.fromEntries(medals(s, P).map((m) => [m.medal, m.won]))
      expect(result['aquiferSafe']).toBe(s.finalGround >= P.groundInitial * GOALS.aquiferSafe - 1e-9)
      expect(result['noOneWithout']).toBe(s.worstCoverage >= GOALS.noOneWithout - 1e-9)
      expect(result['calmBasin']).toBe(s.meanStress < GOALS.calmBasin)
    }
  })
})

describe('medalsSoFar', () => {
  it('[bienvenida#14] tells which medals the game would win if it ended with the drafted year', () => {
    const { history } = playGame(strategy100, P, { years: SC.years.slice(0, 2) })
    const [played, drafted] = history
    expect(medalsSoFar([played], drafted, P)).toEqual(medals(summarize(history), P))
  })
})

const strategy100: Strategy = () => ({ requested: P.demand, buy: [] })
