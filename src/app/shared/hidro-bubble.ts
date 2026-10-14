import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Icon } from './icon'

/** Hidro, the tutor robot, saying what is projected inside. */
@Component({
  selector: 'app-hidro-bubble',
  imports: [Icon],
  template: `
    <div class="flex items-start gap-3">
      <div class="flex flex-none flex-col items-center gap-1">
        <span
          class="flex size-14 items-center justify-center rounded-full border-2 border-water-bright bg-water-soft text-water"
        >
          <app-icon name="tutor" [size]="30" />
        </span>
        <span class="font-display text-sm font-bold text-water-dark">Hidro</span>
      </div>
      <div
        class="min-w-0 flex-1 rounded-[4px_14px_14px_14px] bg-water-soft px-4 py-3 text-[17px] leading-[1.45]"
        aria-live="polite"
      >
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HidroBubble {}
