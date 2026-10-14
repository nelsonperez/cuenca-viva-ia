import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import type { Medal as MedalId } from '../../game/medals'
import { Icon } from './icon'
import { MEDAL_UI } from './medal-ui'

/** won / missing at the end of a game; onTrack / atRisk while playing. */
export type MedalState = 'won' | 'missing' | 'onTrack' | 'atRisk'

const BADGE: Record<MedalState, string> = {
  won: 'bg-amber text-amber-ink border-[#c98a1f]',
  missing: 'bg-ground text-[#9aa8b0] border-line',
  onTrack: 'bg-agr-soft text-agr border-agr',
  atRisk: 'bg-bad-soft text-bad border-bad',
}

const STATE_TEXT: Record<MedalState, string> = {
  won: 'conseguida',
  missing: 'no conseguida',
  onTrack: 'en camino',
  atRisk: 'en riesgo',
}

@Component({
  selector: 'app-medal',
  imports: [Icon],
  template: `
    <span class="flex items-center gap-2" [attr.data-state]="state()">
      <span
        class="flex flex-none items-center justify-center rounded-full border-2"
        [class]="badge()"
        [class.size-12]="!compact()"
        [class.size-8]="compact()"
      >
        <app-icon [name]="ui().icon" [size]="compact() ? 18 : 26" />
      </span>
      <span class="flex flex-col leading-tight">
        <strong [class.text-sm]="compact()" [class.text-muted]="state() === 'missing'">{{ ui().name }}</strong>
        @if (compact()) {
          <span class="text-xs" [class]="state() === 'atRisk' ? 'text-bad' : 'text-agr'">{{ stateText() }}</span>
        } @else {
          <span class="sr-only">{{ stateText() }}</span>
        }
      </span>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Medal {
  readonly medal = input.required<MedalId>()
  readonly state = input.required<MedalState>()
  /** Small version for the mission strip, with the state written out. */
  readonly compact = input(false)

  protected readonly ui = computed(() => MEDAL_UI[this.medal()])
  protected readonly badge = computed(() => BADGE[this.state()])
  protected readonly stateText = computed(() => STATE_TEXT[this.state()])
}
