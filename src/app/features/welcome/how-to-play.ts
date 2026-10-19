import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { GameStore } from '../../core/game.store'
import { HidroBubble } from '../../shared/hidro-bubble'
import { Icon } from '../../shared/icon'
import type { IconName } from '../../shared/icon'

interface Card {
  title: string
  text: string
  /** The same icons the board uses for this part. */
  icons: IconName[]
}

const CARDS: Card[] = [
  {
    title: 'El río trae el agua',
    text: 'Viene del deshielo de la cordillera. Hay años normales, años húmedos y años de sequía: mirá cada año cuánto trae.',
    icons: ['mountain', 'river'],
  },
  {
    title: 'Repartila',
    text: 'Mové cada barra para decidir qué parte de lo que necesita recibe la agricultura, la ciudad y la minería. La barra llena es todo lo que necesita.',
    icons: ['agr', 'mun', 'min'],
  },
  {
    title: 'Cuidá el acuífero',
    text: 'Si el río no alcanza, se bombea agua de abajo de la tierra. El agua que dejás en el río se infiltra y lo recarga.',
    icons: ['arrowDown', 'drop'],
  },
  {
    title: 'Invertí en tecnología',
    text: 'Con tus créditos comprás riego por goteo, reparación de fugas o recirculación minera. Quedan instaladas para siempre.',
    icons: ['drip', 'wrench', 'recycle'],
  },
  {
    title: 'Simulá y aprendé',
    text: 'Apretá "Simular año" y te cuento qué pasó. Al final de la partida ganás medallas según cómo quedó la cuenca.',
    icons: ['play', 'tutor'],
  },
]

@Component({
  selector: 'app-how-to-play',
  imports: [HidroBubble, Icon],
  templateUrl: './how-to-play.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToPlay {
  protected readonly store = inject(GameStore)
  protected readonly cards = CARDS

  /** Which card is showing: view state of this carousel only. */
  protected readonly index = signal(0)
  protected readonly card = computed(() => CARDS[this.index()])
  protected readonly isLast = computed(() => this.index() === CARDS.length - 1)

  protected go(index: number) {
    this.index.set(Math.max(0, Math.min(CARDS.length - 1, index)))
  }
}
