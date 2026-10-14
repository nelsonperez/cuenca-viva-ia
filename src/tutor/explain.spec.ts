import { describe, expect, it } from '@jest/globals'
import { initialState, playGame, step } from '../engine/engine'
import type { Strategy } from '../engine/engine'
import { DEFAULT_PARAMS as P, DEFAULT_SCENARIO as SC } from '../engine/params'
import { TECHNOLOGIES } from '../engine/types'
import type { Decision } from '../engine/types'
import { advise, explainYear, facts, ungroundedNumbers } from './explain'
import { fmt } from './labels'

const full: Decision = { requested: P.demand, buy: [] }
const year = (inflow: number) => ({ years: [{ type: 'drought' as const, inflow }] })
const text = (decision: Decision, scenario = SC, state = initialState(P)) =>
  explainYear(step(state, decision, P, scenario).result).join(' ')

describe('number format', () => {
  it('uses comma decimals and drops trailing zeros', () => {
    expect(fmt(100)).toBe('100')
    expect(fmt(36.55)).toBe('36,5')
    expect(fmt(1.3166, 2)).toBe('1,32')
    expect(fmt(0)).toBe('0')
    expect(fmt(0.5, 2)).toBe('0,5')
  })
})

describe('explainYear', () => {
  it('describes a year the river can cover', () => {
    const explanation = text(full)
    expect(explanation).toContain('Año 1, año normal: el río trajo 100 UE')
    expect(explanation).toContain('El río alcanzó para todo lo que pediste (100 UE)')
    expect(explanation).toContain('No quedó agua en el río')
    expect(explanation).toContain('El riego devolvió 9 UE')
    expect(explanation).toContain('El acuífero subió de 100 a 109 UE')
    expect(explanation).toContain('El estrés hídrico fue 1, nivel alto.')
  })

  it('explains pumping', () => {
    const explanation = text(full, year(70))
    expect(explanation).toContain('el río cubrió 70. El resto, 30 UE, se bombeó del acuífero')
    expect(explanation).toContain('El acuífero bajó de 100 a 79 UE')
  })

  it('explains the cut when the pump cap is reached', () => {
    expect(text(full, year(40))).toContain(
      'El bombeo llegó a su tope (50 UE), así que cada sector recibió el 90 % de lo que pediste',
    )
  })

  it('explains the cut when the aquifer runs dry', () => {
    const state = { ...initialState(P), ground: 5 }
    expect(text(full, year(40), state)).toContain('El acuífero se quedó sin agua para bombear')
  })

  it('explains the recharge from water left in the river', () => {
    const half: Decision = { requested: { agr: 30, mun: 12.5, min: 7.5 }, buy: [] }
    expect(text(half)).toContain(
      'Quedaron 50 UE en el río: 15 infiltraron en el cono aluvial y recargaron el acuífero',
    )
  })

  it('compares stress with and without technology, and flags the drip trade-off', () => {
    const state = { ...initialState(P), credits: 4 }
    const explanation = text({ requested: P.demand, buy: ['drip'] }, SC, state)
    expect(explanation).toContain(
      'Instalaste riego por goteo: la necesidad de la agricultura es ahora de 39 UE en lugar de 60',
    )
    expect(explanation).toContain('también devuelve menos al acuífero: 2 UE')
    expect(explanation).toContain('nivel bajo. Sin riego por goteo habría sido 1.')
  })
})

describe('advise', () => {
  const tip = (decision: Decision, scenario = SC) =>
    advise(step(initialState(P), decision, P, scenario).result)

  it('warns when the request cannot be met', () => {
    expect(tip(full, year(40))).toMatchObject({ tone: 'warning' })
  })

  it('cautions when the aquifer would drop', () => {
    const advice = tip(full, year(70))
    expect(advice.tone).toBe('caution')
    expect(advice.text).toContain('Se bombearían 30 UE y se recargarían 9')
  })

  it('encourages leaving water in the river', () => {
    const advice = tip({ requested: { agr: 30, mun: 12.5, min: 7.5 }, buy: [] })
    expect(advice.tone).toBe('good')
    expect(advice.text).toContain('Dejás 50 UE en el río')
  })
})

describe('grounding', () => {
  it('flags numbers that are not facts of the year', () => {
    const known = facts(step(initialState(P), full, P, SC).result)
    expect(ungroundedNumbers('El acuífero subió a 109 UE.', known)).toEqual([])
    expect(ungroundedNumbers('El acuífero subió a 112 UE, un 7,5 % más.', known)).toEqual([
      '112',
      '7,5',
    ])
  })

  it('never writes a number the engine did not produce', () => {
    const random = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let seed = 1; seed <= 200; seed++) {
      const next = random(seed)
      const strategy: Strategy = () => ({
        requested: { agr: next() * 70, mun: next() * 30, min: next() * 20 },
        buy: TECHNOLOGIES.filter(() => next() < 0.3),
      })
      const scenario = { years: SC.years.map((y) => ({ ...y, inflow: 10 + next() * 150 })) }
      for (const result of playGame(strategy, P, scenario).history) {
        const known = facts(result)
        expect(ungroundedNumbers(explainYear(result).join(' '), known)).toEqual([])
        expect(ungroundedNumbers(advise(result).text, known)).toEqual([])
      }
    }
  })
})

describe('edge cases', () => {
  const nothing: Decision = { requested: { agr: 0, mun: 0, min: 0 }, buy: [] }
  const still = step(initialState(P), nothing, P, year(0)).result

  it('explains a year in which the aquifer does not change', () => {
    const explanation = explainYear(still).join(' ')
    expect(explanation).toContain('El acuífero se mantuvo en 100 UE.')
    expect(explanation).not.toContain('El riego devolvió')
    expect(advise(still).text).toBe('El río alcanza para lo que pedís y el acuífero no cambiaría este año.')
  })

  it('counts a year with nothing requested as fully delivered', () => {
    expect(facts(still).deliveredSharePercent).toBe(100)
  })

  it('ignores facts that are not finite and texts without numbers', () => {
    expect(ungroundedNumbers('Estrés 3', { stress: Infinity })).toEqual(['3'])
    expect(ungroundedNumbers('Sin números', { inflow: 100 })).toEqual([])
  })

  it('never writes a negative zero', () => {
    expect(fmt(-0.04)).toBe('0')
  })
})
