import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { GameStore } from './core/game.store'
import { Board } from './features/board/board'
import { Header } from './features/board/header'
import { Summary } from './features/summary/summary'

@Component({
  selector: 'app-root',
  imports: [Board, Header, Summary],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(GameStore)
}
