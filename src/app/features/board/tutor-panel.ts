import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TutorService } from '../../core/tutor.service'
import { Icon } from '../../shared/icon'

const TIP = {
  good: 'bg-agr-soft',
  caution: 'bg-amber-soft',
  warning: 'bg-bad-soft',
} as const

@Component({
  selector: 'app-tutor-panel',
  imports: [Icon],
  templateUrl: './tutor-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorPanel {
  protected readonly tutor = inject(TutorService)
  protected readonly tipClass = TIP
}
