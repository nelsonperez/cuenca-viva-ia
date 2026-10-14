import type { Sector, StressBand, Technology, YearType } from '../../../engine/types'
import type { TechnologyStatus } from '../../core/game.store'
import type { IconName } from '../../shared/icon'

/** Screen texts and classes of the board. Numbers never live here. */

export const SECTOR_UI: Record<Sector, { title: string; icon: IconName; tone: string }> = {
  agr: { title: 'Agricultura', icon: 'agr', tone: 'tone-agr' },
  mun: { title: 'Ciudad', icon: 'mun', tone: 'tone-mun' },
  min: { title: 'Minería', icon: 'min', tone: 'tone-min' },
}

export const TECHNOLOGY_UI: Record<Technology, { title: string; effect: string; icon: IconName }> = {
  drip: { title: 'Riego por goteo', effect: 'de necesidad del agro', icon: 'drip' },
  leaks: { title: 'Reparar fugas', effect: 'de necesidad de la ciudad', icon: 'wrench' },
  recirc: { title: 'Recirculación minera', effect: 'de necesidad de la minería', icon: 'recycle' },
}

export const TECHNOLOGY_STATUS: Record<TechnologyStatus, string> = {
  owned: 'Instalada',
  selected: 'Se instala este año',
  locked: 'Créditos insuficientes',
  available: 'Comprar',
}

export const MELT: Record<YearType, string> = {
  normal: 'Deshielo medio',
  drought: 'Deshielo bajo',
  extremeDrought: 'Deshielo muy bajo',
  wet: 'Deshielo alto',
}

export const BAND_TEXT: Record<StressBand, string> = {
  low: 'text-band-low',
  moderate: 'text-band-moderate',
  high: 'text-band-high',
  critical: 'text-band-critical',
}

export const BAND_FILL: Record<StressBand, string> = {
  low: 'bg-band-low-fill',
  moderate: 'bg-band-moderate-fill',
  high: 'bg-band-high-fill',
  critical: 'bg-band-critical-fill',
}

/** Share of a scale, clamped to 0–100, for bar widths. */
export const percent = (value: number, max: number) => Math.max(0, Math.min(100, (value / max) * 100))
