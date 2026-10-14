import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { TECHNOLOGIES } from '../../../engine/types'
import type { GameSummary } from '../../../engine/types'
import { BAND_NAME, TECHNOLOGY_NAME, YEAR_NAME, fmt } from '../../../tutor/labels'
import { GameStore } from '../../core/game.store'
import { FmtPipe } from '../../shared/fmt.pipe'
import { capitalize } from '../../shared/text'
import { BAND_TEXT } from '../board/board-ui'

const ROWS: { label: string; value: (summary: GameSummary) => string }[] = [
  { label: 'Acuífero al final', value: (s) => `${fmt(s.finalGround)} UE` },
  {
    label: 'Cambio del acuífero',
    value: (s) => `${s.groundChange >= 0 ? '+' : '−'}${fmt(Math.abs(s.groundChange))} UE`,
  },
  { label: 'Bombeo total', value: (s) => `${fmt(s.totalPumping)} UE` },
  { label: 'Recarga total', value: (s) => `${fmt(s.totalRecharge)} UE` },
  { label: 'Estrés hídrico medio', value: (s) => fmt(s.meanStress, 2) },
  { label: 'Agricultura atendida', value: (s) => `${fmt(s.meanCoverage.agr * 100, 0)} %` },
  { label: 'Ciudad atendida', value: (s) => `${fmt(s.meanCoverage.mun * 100, 0)} %` },
  { label: 'Minería atendida', value: (s) => `${fmt(s.meanCoverage.min * 100, 0)} %` },
  {
    label: 'Tecnologías instaladas',
    value: (s) => {
      const installed = TECHNOLOGIES.filter((t) => s.owned[t]).map((t) => TECHNOLOGY_NAME[t])
      return installed.length > 0 ? installed.join(', ') : 'ninguna'
    },
  },
]

@Component({
  selector: 'app-summary',
  imports: [FmtPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Summary {
  protected readonly store = inject(GameStore)
  protected readonly rows = ROWS
  protected readonly yearName = (type: keyof typeof YEAR_NAME) => capitalize(YEAR_NAME[type])
  protected readonly bandName = BAND_NAME
  protected readonly bandText = BAND_TEXT

  /** The game just finished and, if there is one, the one before it. */
  protected readonly games = computed(() => {
    const finished = this.store.game().finished
    const current = finished.at(-1)
    if (!current) return null
    return { current, previous: finished.length > 1 ? finished[0] : null }
  })

  protected restart() {
    this.store.dispatch({ type: 'restart' })
  }
}
