import { Injectable, computed, inject, signal } from '@angular/core'
import { purchase } from '../../engine/engine'
import { TECHNOLOGIES } from '../../engine/types'
import type { Technology, TechnologySpec, YearType } from '../../engine/types'
import { newGame, preview, reduce } from '../../game/game'
import type { Action, Game } from '../../game/game'
import { facts } from '../../tutor/explain'
import { PARAMS, SCENARIO } from './game.tokens'

export type TechnologyStatus = 'owned' | 'selected' | 'locked' | 'available'

export interface TechnologyOption {
  technology: Technology
  spec: TechnologySpec
  status: TechnologyStatus
}

/**
 * Game state as signals. Every rule lives in the pure domain (ADR 005):
 * this store only keeps the current `Game` and applies `reduce` to it.
 */
@Injectable({ providedIn: 'root' })
export class GameStore {
  readonly params = inject(PARAMS)
  readonly scenario = inject(SCENARIO)
  readonly totalYears = this.scenario.years.length

  private readonly state = signal<Game>(newGame(this.params))
  readonly game = this.state.asReadonly()

  /** Result of the drafted decision; null once the game is over. */
  readonly preview = computed(() => preview(this.state(), this.params, this.scenario))
  readonly facts = computed(() => {
    const drafted = this.preview()
    return drafted ? facts(drafted) : null
  })

  readonly currentYear = computed(() => Math.min(this.state().basin.year, this.totalYears - 1))
  readonly isLastYear = computed(() => this.state().basin.year === this.totalYears - 1)
  readonly nextYearType = computed<YearType | null>(
    () => this.scenario.years[this.state().basin.year + 1]?.type ?? null,
  )
  readonly lastYear = computed(() => this.state().history.at(-1) ?? null)

  readonly creditsLeft = computed(() => {
    const { basin, draft } = this.state()
    return purchase(basin, draft.buy, this.params).credits
  })

  readonly technologies = computed<TechnologyOption[]>(() => {
    const { basin, draft } = this.state()
    const credits = this.creditsLeft()
    return TECHNOLOGIES.map((technology) => {
      const spec = this.params.technologies[technology]
      const status: TechnologyStatus = basin.owned[technology]
        ? 'owned'
        : draft.buy.includes(technology)
          ? 'selected'
          : spec.cost > credits
            ? 'locked'
            : 'available'
      return { technology, spec, status }
    })
  })

  dispatch(action: Action): void {
    this.state.update((game) => reduce(game, action, this.params, this.scenario))
  }
}
