import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { YEAR_NAME } from '../../../tutor/labels'
import { GameStore } from '../../core/game.store'
import { Icon } from '../../shared/icon'
import { Allocation } from './allocation'
import { Aquifer } from './aquifer'
import { BasinMap } from './basin-map'
import { Technologies } from './technologies'
import { TutorPanel } from './tutor-panel'

@Component({
  selector: 'app-board',
  imports: [Allocation, Aquifer, BasinMap, Icon, Technologies, TutorPanel],
  templateUrl: './board.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  protected readonly store = inject(GameStore)

  protected readonly hint = computed(() => {
    const next = this.store.nextYearType()
    return this.store.isLastYear() || !next ? 'Último año de la partida' : `Sigue: ${YEAR_NAME[next]}`
  })

  protected simulate() {
    this.store.dispatch({ type: 'simulate' })
  }
}
