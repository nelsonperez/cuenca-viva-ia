import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { GOALS } from '../../../engine/params'
import { MEDALS } from '../../../game/medals'
import { GameStore } from '../../core/game.store'
import { HidroBubble } from '../../shared/hidro-bubble'
import { Icon } from '../../shared/icon'
import { Medal } from '../../shared/medal'
import { MEDAL_UI } from '../../shared/medal-ui'

@Component({
  selector: 'app-welcome',
  imports: [HidroBubble, Icon, Medal],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Welcome {
  protected readonly store = inject(GameStore)
  protected readonly medals = MEDALS
  protected readonly ui = MEDAL_UI
  protected readonly goals = GOALS
}
