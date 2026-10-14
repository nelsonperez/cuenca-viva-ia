import { demandWith, initialState, isGameOver, purchase, step, summarize } from '../engine/engine'
import { SECTORS } from '../engine/types'
import type {
  BasinState,
  Decision,
  GameSummary,
  Params,
  PerSector,
  Scenario,
  Sector,
  Technology,
  YearResult,
} from '../engine/types'

/** What the player is setting up before simulating the year. */
export interface Draft {
  /** Share of each sector's need to deliver, 0 to 100. */
  coverage: PerSector
  buy: Technology[]
}

export interface FinishedGame {
  history: YearResult[]
  summary: GameSummary
}

export interface Game {
  basin: BasinState
  history: YearResult[]
  draft: Draft
  /** Finished games, oldest first; only the last two are kept for comparison. */
  finished: FinishedGame[]
}

export type Action =
  | { type: 'setCoverage'; sector: Sector; value: number }
  | { type: 'toggleBuy'; technology: Technology }
  | { type: 'simulate' }
  | { type: 'restart' }

const FULL_COVERAGE: PerSector = { agr: 100, mun: 100, min: 100 }

export function newGame(params: Params, finished: FinishedGame[] = []): Game {
  return {
    basin: initialState(params),
    history: [],
    draft: { coverage: FULL_COVERAGE, buy: [] },
    finished,
  }
}

/** Turns the draft into an engine decision, using the demand after the drafted purchases. */
export function toDecision(game: Game, params: Params): Decision {
  const { owned } = purchase(game.basin, game.draft.buy, params)
  const demand = demandWith(owned, params)
  const requested = { ...demand }
  for (const sector of SECTORS) requested[sector] = (demand[sector] * game.draft.coverage[sector]) / 100
  return { requested, buy: game.draft.buy }
}

/** Result of the drafted decision, without advancing the game. */
export function preview(game: Game, params: Params, scenario: Scenario): YearResult | null {
  if (isGameOver(game.basin, scenario)) return null
  return step(game.basin, toDecision(game, params), params, scenario).result
}

export function reduce(game: Game, action: Action, params: Params, scenario: Scenario): Game {
  switch (action.type) {
    case 'setCoverage': {
      const value = Math.min(100, Math.max(0, action.value))
      return {
        ...game,
        draft: { ...game.draft, coverage: { ...game.draft.coverage, [action.sector]: value } },
      }
    }
    case 'toggleBuy': {
      const selected = game.draft.buy.includes(action.technology)
      const buy = selected
        ? game.draft.buy.filter((t) => t !== action.technology)
        : [...game.draft.buy, action.technology]
      // Keep only what is actually affordable together.
      return { ...game, draft: { ...game.draft, buy: purchase(game.basin, buy, params).purchased } }
    }
    case 'simulate': {
      if (isGameOver(game.basin, scenario)) return game
      const { state, result } = step(game.basin, toDecision(game, params), params, scenario)
      const history = [...game.history, result]
      const finished = isGameOver(state, scenario)
        ? [...game.finished, { history, summary: summarize(history) }].slice(-2)
        : game.finished
      return { basin: state, history, draft: { ...game.draft, buy: [] }, finished }
    }
    case 'restart':
      return newGame(params, game.finished)
  }
}
