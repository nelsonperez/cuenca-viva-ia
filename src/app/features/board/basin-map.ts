import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { SECTORS } from '../../../engine/types'
import { GameStore } from '../../core/game.store'
import { FmtPipe } from '../../shared/fmt.pipe'
import { Icon } from '../../shared/icon'
import { MELT, SECTOR_UI } from './board-ui'

@Component({
  selector: 'app-basin-map',
  imports: [FmtPipe, Icon],
  templateUrl: './basin-map.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasinMap {
  protected readonly store = inject(GameStore)
  protected readonly sectors = SECTORS
  protected readonly ui = SECTOR_UI
  protected readonly melt = MELT
}
