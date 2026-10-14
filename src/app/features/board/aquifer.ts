import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { GameStore } from '../../core/game.store'
import { FmtPipe } from '../../shared/fmt.pipe'
import { percent } from './board-ui'

/** Scale of the recharge and pumping bars, in UE. */
const FLOW_SCALE = 50

const TANK_FILL = { ok: 'bg-[#1f7fb5]', low: 'bg-[#b9790f]', critical: 'bg-bad' } as const

@Component({
  selector: 'app-aquifer',
  imports: [FmtPipe],
  templateUrl: './aquifer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Aquifer {
  protected readonly store = inject(GameStore)

  protected readonly view = computed(() => {
    const p = this.store.preview()
    const f = this.store.facts()
    if (!p || !f) return null
    const max = this.store.params.groundMax
    const level = percent(p.groundBefore, max)
    return {
      p,
      level,
      projected: percent(p.groundAfter, max),
      rises: p.groundAfter >= p.groundBefore,
      change: f['groundChange'],
      recharge: f['totalRecharge'],
      rechargeWidth: percent(f['totalRecharge'], FLOW_SCALE),
      pumpingWidth: percent(p.pumping, FLOW_SCALE),
      fill: TANK_FILL[level > 40 ? 'ok' : level > 25 ? 'low' : 'critical'],
    }
  })
}
