import { Injectable, computed, inject } from '@angular/core'
import { advise, explainYear } from '../../tutor/explain'
import { GameStore } from './game.store'

/** The rule-based tutor, following the game state. Texts come from `src/tutor/`. */
@Injectable({ providedIn: 'root' })
export class TutorService {
  private readonly store = inject(GameStore)

  /** One-sentence warning about the drafted decision; null once the game is over. */
  readonly advice = computed(() => {
    const drafted = this.store.preview()
    return drafted ? advise(drafted) : null
  })

  /** Explanation of the last simulated year; empty before the first one. */
  readonly lastYear = computed(() => {
    const last = this.store.lastYear()
    return last ? explainYear(last) : []
  })
}
