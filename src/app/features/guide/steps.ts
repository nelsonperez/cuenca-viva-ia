import type { YearResult } from '../../../engine/types'
import { fmt } from '../../../tutor/labels'
import type { GuideZone } from '../../core/guide'

export interface StepContext {
  preview: YearResult
  credits: number
}

/** What Hidro says at each step of the first-year guide; numbers come from the preview. */
export const STEP_TEXT: Record<GuideZone, (c: StepContext) => string> = {
  river: (c) =>
    `Este año el río trae ${fmt(c.preview.inflow)} UE. Es toda el agua que tenés para repartir sin tocar el acuífero.`,
  allocation: () =>
    'Mové una barra: decidís qué parte de lo que necesita recibe cada sector. Probá con la agricultura.',
  stress: () =>
    '¿Viste? El estrés hídrico y el acuífero cambian antes de simular. Así podés probar sin riesgo.',
  technologies: (c) =>
    `Tenés ${fmt(c.credits)} créditos. Una tecnología baja para siempre lo que necesita un sector. Las bloqueadas cuestan más de lo que tenés.`,
  play: () => 'Cuando estés conforme, apretá "Simular año". Después te cuento qué pasó.',
}

/** What the player has to do to move on, for steps that wait for an action. */
export const STEP_WAITING: Partial<Record<GuideZone, string>> = {
  allocation: 'Mové una barra para seguir.',
  play: 'Simulá el año para seguir.',
}
