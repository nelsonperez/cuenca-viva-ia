import type { Goals } from '../../engine/types'
import { fmt } from '../../tutor/labels'
import type { Medal } from '../../game/medals'
import type { IconName } from './icon'

/** Names, goals and Hidro's tips for the three medals. Numbers come from the goals. */
export const MEDAL_UI: Record<
  Medal,
  { name: string; icon: IconName; goal: (goals: Goals) => string; tip: string }
> = {
  aquiferSafe: {
    name: 'Acuífero a salvo',
    icon: 'shield',
    goal: (g) => `Terminá con al menos ${fmt(g.aquiferSafe * 100, 0)} % del agua subterránea con la que empezaste.`,
    tip: 'Para salvar el acuífero, dejá agua en el río los años buenos y bombeá menos en las sequías.',
  },
  noOneWithout: {
    name: 'Nadie sin agua',
    icon: 'people',
    goal: (g) => `Que ningún sector reciba menos del ${fmt(g.noOneWithout * 100, 0)} % de lo que necesita, ningún año.`,
    tip: 'Para que nadie se quede sin agua, no bajes tanto a ningún sector, ni siquiera en las sequías.',
  },
  calmBasin: {
    name: 'Cuenca en calma',
    icon: 'calm',
    goal: (g) => `Que el estrés hídrico medio de la partida quede por debajo de ${fmt(g.calmBasin)}.`,
    tip: 'Para calmar la cuenca, instalá tecnologías temprano: bajan para siempre lo que necesita cada sector.',
  },
}
