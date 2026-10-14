import { describe, expect, it } from '@jest/globals'
import { DEFAULT_PARAMS as P, DEFAULT_SCENARIO as SC } from '../engine/params'
import { newGame, preview, reduce, toDecision } from './game'
import type { Action, Game } from './game'

const play = (game: Game, ...actions: Action[]) =>
  actions.reduce((current, action) => reduce(current, action, P, SC), game)

const simulate: Action = { type: 'simulate' }

describe('game', () => {
  it('starts delivering every sector its full need', () => {
    expect(toDecision(newGame(P), P).requested).toEqual(P.demand)
  })

  it('previews the drafted decision without advancing', () => {
    const game = play(newGame(P), { type: 'setCoverage', sector: 'agr', value: 50 })
    expect(preview(game, P, SC)?.riverFlow).toBe(30)
    expect(game.basin.year).toBe(0)
    expect(game.history).toHaveLength(0)
  })

  it('does not let the player draft a purchase it cannot afford', () => {
    const game = play(newGame(P), { type: 'toggleBuy', technology: 'drip' })
    expect(game.draft.buy).toEqual([])
    expect(play(game, { type: 'toggleBuy', technology: 'leaks' }).draft.buy).toEqual(['leaks'])
  })

  it('applies the coverage to the demand after the drafted purchase', () => {
    const game = play(
      newGame(P),
      { type: 'toggleBuy', technology: 'leaks' },
      { type: 'setCoverage', sector: 'mun', value: 50 },
    )
    expect(toDecision(game, P).requested.mun).toBeCloseTo(10)
  })

  it('simulating advances a year, keeps the coverage and clears the purchases', () => {
    const game = play(
      newGame(P),
      { type: 'toggleBuy', technology: 'leaks' },
      { type: 'setCoverage', sector: 'agr', value: 80 },
      simulate,
    )
    expect(game.basin.year).toBe(1)
    expect(game.basin.owned.leaks).toBe(true)
    expect(game.draft).toEqual({ coverage: { agr: 80, mun: 100, min: 100 }, buy: [] })
    expect(game.history).toHaveLength(1)
  })

  it('records the finished game and keeps it after restarting', () => {
    const done = play(newGame(P), simulate, simulate, simulate, simulate, simulate)
    expect(preview(done, P, SC)).toBeNull()
    expect(done.finished).toHaveLength(1)
    expect(done.finished[0].summary.finalGround).toBeCloseTo(20.55)
    expect(play(done, simulate)).toBe(done)

    const again = play(done, { type: 'restart' })
    expect(again.basin.year).toBe(0)
    expect(again.history).toHaveLength(0)
    expect(again.finished).toHaveLength(1)
  })

  it('toggling a drafted purchase again removes it', () => {
    const leaks: Action = { type: 'toggleBuy', technology: 'leaks' }
    expect(play(newGame(P), leaks).draft.buy).toEqual(['leaks'])
    expect(play(newGame(P), leaks, leaks).draft.buy).toEqual([])
  })
})
