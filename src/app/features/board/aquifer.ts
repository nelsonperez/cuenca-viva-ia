import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { GameStore } from '../../core/game.store'
import { fmt } from '../../../tutor/labels'
import { FmtPipe } from '../../shared/fmt.pipe'
import { percent } from './board-ui'

/** Scale of the recharge and pumping bars, in UE. */
const FLOW_SCALE = 50

/** A signed amount, with no sign when it is zero ("0", never "−0"). */
const signed = (value: number, sign: '+' | '−') => (value > 0 ? `${sign}${fmt(value)}` : fmt(value))

/** Above this projection the tank percentage moves down, so the line never covers it. */
const LABEL_SWITCH = 65

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
    const projected = percent(p.groundAfter, max)
    const change = f['groundChange']
    return {
      p,
      max,
      level,
      projected,
      labelAt: projected < LABEL_SWITCH ? ('top' as const) : ('bottom' as const),
      rises: p.groundAfter >= p.groundBefore,
      change: change === 0 ? fmt(0) : signed(change, p.groundAfter > p.groundBefore ? '+' : '−'),
      recharge: signed(f['totalRecharge'], '+'),
      pumping: signed(p.pumping, '−'),
      rechargeWidth: percent(f['totalRecharge'], FLOW_SCALE),
      pumpingWidth: percent(p.pumping, FLOW_SCALE),
      fill: TANK_FILL[level > 40 ? 'ok' : level > 25 ? 'low' : 'critical'],
    }
  })
}
