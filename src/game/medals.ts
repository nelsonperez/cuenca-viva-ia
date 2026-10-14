import { summarize } from '../engine/engine'
import { GOALS } from '../engine/params'
import type { GameSummary, Goals, Params, YearResult } from '../engine/types'

export const MEDALS = ['aquiferSafe', 'noOneWithout', 'calmBasin'] as const
export type Medal = (typeof MEDALS)[number]

export interface MedalResult {
  medal: Medal
  won: boolean
}

/** Room for floating-point error, so a value right at a threshold counts. */
const EPSILON = 1e-9

/** The three medals of a finished game, in a fixed order. */
export function medals(summary: GameSummary, params: Params, goals: Goals = GOALS): MedalResult[] {
  const won: Record<Medal, boolean> = {
    aquiferSafe: summary.finalGround >= params.groundInitial * goals.aquiferSafe - EPSILON,
    noOneWithout: summary.worstCoverage >= goals.noOneWithout - EPSILON,
    calmBasin: summary.meanStress < goals.calmBasin,
  }
  return MEDALS.map((medal) => ({ medal, won: won[medal] }))
}

/** Medals the game would win if it ended with the drafted year. */
export function medalsSoFar(
  history: YearResult[],
  drafted: YearResult,
  params: Params,
  goals: Goals = GOALS,
): MedalResult[] {
  return medals(summarize([...history, drafted]), params, goals)
}
