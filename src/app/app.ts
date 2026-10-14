import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { GameStore } from './core/game.store'
import { Board } from './features/board/board'
import { Header } from './features/board/header'
import { GuideOverlay } from './features/guide/guide-overlay'
import { Summary } from './features/summary/summary'
import { HowToPlay } from './features/welcome/how-to-play'
import { Welcome } from './features/welcome/welcome'

@Component({
  selector: 'app-root',
  imports: [Board, GuideOverlay, Header, HowToPlay, Summary, Welcome],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(GameStore)
}
