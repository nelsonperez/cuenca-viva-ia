import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import type { Technology } from '../../../engine/types'
import { GameStore } from '../../core/game.store'
import type { TechnologyStatus } from '../../core/game.store'
import { FmtPipe } from '../../shared/fmt.pipe'
import { Icon } from '../../shared/icon'
import { TECHNOLOGY_STATUS, TECHNOLOGY_UI } from './board-ui'

const CARD: Record<TechnologyStatus, string> = {
  available: 'border-line bg-white hover:border-water-bright hover:shadow-[0_6px_18px_rgba(11,79,122,0.12)]',
  selected: 'border-water bg-[#e6f2fa] shadow-[0_0_0_4px_rgba(19,138,192,0.18)]',
  owned: 'border-agr bg-agr-soft cursor-default',
  locked: 'border-line border-dashed bg-white text-muted cursor-not-allowed',
}

const CHIP: Record<TechnologyStatus, string> = {
  available: 'bg-ground text-[#3e4f58]',
  selected: 'bg-water text-white',
  owned: 'bg-agr text-white',
  locked: 'bg-ground text-[#3e4f58]',
}

@Component({
  selector: 'app-technologies',
  imports: [FmtPipe, Icon],
  templateUrl: './technologies.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Technologies {
  protected readonly store = inject(GameStore)
  protected readonly ui = TECHNOLOGY_UI
  protected readonly statusText = TECHNOLOGY_STATUS
  protected readonly cardClass = CARD
  protected readonly chipClass = CHIP

  /** Stress with and without the technologies, when they make a difference. */
  protected readonly effect = computed(() => {
    const p = this.store.preview()
    return p && p.stressWithoutTechnology > p.stress ? p : null
  })

  protected toggle(technology: Technology) {
    this.store.dispatch({ type: 'toggleBuy', technology })
  }
}
