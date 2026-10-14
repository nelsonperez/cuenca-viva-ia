import type { Sector, StressBand, Technology, YearType } from '../engine/types'

export const SECTOR_NAME: Record<Sector, string> = {
  agr: 'la agricultura',
  mun: 'la ciudad',
  min: 'la minería',
}

export const TECHNOLOGY_NAME: Record<Technology, string> = {
  drip: 'riego por goteo',
  leaks: 'reparación de fugas',
  recirc: 'recirculación minera',
}

export const YEAR_NAME: Record<YearType, string> = {
  normal: 'año normal',
  drought: 'año de sequía',
  extremeDrought: 'sequía extrema',
  wet: 'año húmedo',
}

export const BAND_NAME: Record<StressBand, string> = {
  low: 'bajo',
  moderate: 'moderado',
  high: 'alto',
  critical: 'crítico',
}

/** Spanish number format: comma decimals, no trailing zeros. */
export function fmt(value: number, decimals = 1): string {
  const fixed = value.toFixed(decimals)
  const trimmed = decimals > 0 ? fixed.replace(/\.?0+$/, '') : fixed
  return (trimmed === '-0' ? '0' : trimmed).replace('.', ',')
}
