import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { SECTORS } from '../../../engine/types'
import type { Sector } from '../../../engine/types'
import { BAND_NAME } from '../../../tutor/labels'
import { GameStore } from '../../core/game.store'
import { FmtPipe } from '../../shared/fmt.pipe'
import { Icon } from '../../shared/icon'
import { capitalize } from '../../shared/text'
import { BAND_FILL, BAND_TEXT, SECTOR_UI } from './board-ui'

const PILL = {
  ok: 'bg-agr-soft text-good-ink',
  warn: 'bg-amber-soft text-amber-ink',
  bad: 'bg-bad-soft text-bad',
} as const

@Component({
  selector: 'app-allocation',
  imports: [FmtPipe, Icon],
  templateUrl: './allocation.html',
  styleUrl: './allocation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Allocation {
  protected readonly store = inject(GameStore)
  protected readonly sectors = SECTORS
  protected readonly ui = SECTOR_UI

  protected readonly view = computed(() => {
    const p = this.store.preview()
    const f = this.store.facts()
    if (!p || !f) return null
    const requested = f['totalRequested']
    const pill = p.rules.includes('proportionalCut') ? 'bad' : requested > p.inflow ? 'warn' : 'ok'
    return {
      p,
      requested,
      used: f['totalDelivered'],
      pill: PILL[pill],
      band: capitalize(BAND_NAME[p.stressBand]),
      bandText: BAND_TEXT[p.stressBand],
      bandFill: BAND_FILL[p.stressBand],
      /** The meter reaches its end at a stress of 2; its middle mark is 1. */
      meter: Math.min(100, p.stress * 50),
    }
  })

  protected setCoverage(sector: Sector, event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    this.store.dispatch({ type: 'setCoverage', sector, value })
  }
}
