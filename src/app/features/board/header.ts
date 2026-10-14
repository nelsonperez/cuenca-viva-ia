import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { GameStore } from '../../core/game.store'
import { YEAR_NAME } from '../../../tutor/labels'
import { Icon } from '../../shared/icon'
import { Medal } from '../../shared/medal'
import { capitalize } from '../../shared/text'

const STEP_CLASS = { done: 'bg-[#9a5b00]', now: 'bg-amber', next: 'bg-[#f2ddbb]' } as const

@Component({
  selector: 'app-header',
  imports: [Icon, Medal],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly store = inject(GameStore)
  protected readonly stepClass = STEP_CLASS

  protected readonly turn = computed(() => {
    const drafted = this.store.preview()
    if (!drafted) return 'Partida terminada'
    const year = this.store.currentYear() + 1
    return `Año ${year} de ${this.store.totalYears} · ${capitalize(YEAR_NAME[drafted.yearType])}`
  })

  /** Medals on track with the drafted year, while playing. */
  protected readonly mission = computed(() =>
    this.store.screen() === 'playing' ? this.store.mission() : null,
  )

  protected readonly steps = computed(() => {
    const played = this.store.game().basin.year
    return this.store.scenario.years.map((_, index) =>
      index < played ? ('done' as const) : index === played ? ('now' as const) : ('next' as const),
    )
  })
}
