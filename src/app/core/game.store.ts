import { Injectable, computed, inject, signal } from '@angular/core'
import { purchase } from '../../engine/engine'
import { TECHNOLOGIES } from '../../engine/types'
import type { Technology, TechnologySpec, YearType } from '../../engine/types'
import { newGame, preview, reduce } from '../../game/game'
import type { Action, Game } from '../../game/game'
import { medals, medalsSoFar } from '../../game/medals'
import { facts } from '../../tutor/explain'
import { GUIDE_STEPS } from './guide'
import { PARAMS, SCENARIO } from './game.tokens'

export type Screen = 'welcome' | 'howTo' | 'playing'

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

  private readonly screenState = signal<Screen>('welcome')
  readonly screen = this.screenState.asReadonly()

  /** Index in GUIDE_STEPS of the current first-year guide step; null when there is no guide. */
  private readonly guideState = signal<number | null>(null)
  readonly guideStep = this.guideState.asReadonly()
  private guideShown = false

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

  /** Medals the game would win if it ended with the drafted year; null once it is over. */
  readonly mission = computed(() => {
    const drafted = this.preview()
    return drafted ? medalsSoFar(this.state().history, drafted, this.params) : null
  })

  /** Medals of the last finished game. */
  readonly medals = computed(() => {
    const last = this.state().finished.at(-1)
    return last ? medals(last.summary, this.params) : null
  })

  dispatch(action: Action): void {
    this.state.update((game) => reduce(game, action, this.params, this.scenario))
    this.followGuide(action)
  }

  /** "Nueva partida": plays from year 1; the guide only runs the first time. */
  start(): void {
    if (!this.preview()) this.dispatch({ type: 'restart' })
    this.screenState.set('playing')
    if (!this.guideShown) {
      this.guideShown = true
      this.guideState.set(0)
    }
  }

  showHowTo(): void {
    this.screenState.set('howTo')
  }

  backToStart(): void {
    this.guideState.set(null)
    this.screenState.set('welcome')
  }

  /** "Entendido": moves on from a step that does not wait for an action. */
  nextGuideStep(): void {
    const step = this.guideState()
    if (step === null || GUIDE_STEPS[step].advanceOn !== null) return
    this.advanceGuide(step)
  }

  skipGuide(): void {
    this.guideState.set(null)
  }

  private followGuide(action: Action): void {
    const step = this.guideState()
    if (step === null) return
    if (GUIDE_STEPS[step].advanceOn === action.type) this.advanceGuide(step)
    // Simulating early means the player is already playing on their own.
    else if (action.type === 'simulate') this.guideState.set(null)
  }

  private advanceGuide(step: number): void {
    this.guideState.set(step + 1 < GUIDE_STEPS.length ? step + 1 : null)
  }
}
