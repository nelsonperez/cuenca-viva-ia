import type { Action } from '../../game/game'

/** Part of the board that a guide step points at. */
export type GuideZone = 'river' | 'allocation' | 'stress' | 'technologies' | 'play'

export interface GuideStep {
  zone: GuideZone
  /** Action the player must take to move on; null when "Entendido" is enough. */
  advanceOn: Action['type'] | null
}

/** The first-year guide (spec bienvenida-y-mision, req. 5–6). Texts live in the UI. */
export const GUIDE_STEPS: readonly GuideStep[] = [
  { zone: 'river', advanceOn: null },
  { zone: 'allocation', advanceOn: 'setCoverage' },
  { zone: 'stress', advanceOn: null },
  { zone: 'technologies', advanceOn: null },
  { zone: 'play', advanceOn: 'simulate' },
]
