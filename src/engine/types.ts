export const SECTORS = ['agr', 'mun', 'min'] as const
export type Sector = (typeof SECTORS)[number]
export type PerSector = Record<Sector, number>

export const TECHNOLOGIES = ['drip', 'leaks', 'recirc'] as const
export type Technology = (typeof TECHNOLOGIES)[number]
export type Owned = Record<Technology, boolean>

/** Each technology saves water in one sector. */
export const TECHNOLOGY_SECTOR: Record<Technology, Sector> = {
  drip: 'agr',
  leaks: 'mun',
  recirc: 'min',
}

export interface TechnologySpec {
  cost: number
  /** Fraction of the sector demand saved once installed. */
  saving: number
}

export type YearType = 'normal' | 'drought' | 'extremeDrought' | 'wet'

export interface Year {
  type: YearType
  /** River water available this year. */
  inflow: number
}

/** All quantities are educational units (UE); none is calibrated with real data. */
export interface Params {
  groundMax: number
  groundInitial: number
  demand: PerSector
  /** Fraction of the water left in the river that infiltrates to the aquifer. */
  riverRecharge: number
  /** Fraction of agricultural delivery that returns to the aquifer. */
  irrigationReturn: number
  /** Same, once drip irrigation is installed. */
  irrigationReturnDrip: number
  pumpMax: number
  creditsInitial: number
  creditsPerYear: number
  technologies: Record<Technology, TechnologySpec>
}

export interface Scenario {
  years: Year[]
}

export interface BasinState {
  /** Zero-based index of the next year to play. */
  year: number
  ground: number
  /** Credits available to spend this year. */
  credits: number
  owned: Owned
}

export interface Decision {
  /** Water requested per sector; clamped to [0, demand]. */
  requested: PerSector
  /** Technologies to buy this year; they take effect immediately and stay. */
  buy: Technology[]
}

export type Rule =
  | 'pumping'
  | 'pumpCapReached'
  | 'aquiferExhausted'
  | 'proportionalCut'
  | 'riverRecharge'
  | 'groundSpill'
  | 'technologyPurchased'
  | 'dripReducesReturn'

export type StressBand = 'low' | 'moderate' | 'high' | 'critical'

export interface YearResult {
  year: number
  yearType: YearType
  inflow: number
  /** Demand before technologies. */
  baseDemand: PerSector
  demand: PerSector
  requested: PerSector
  delivered: PerSector
  coverage: PerSector
  riverUse: number
  /** Water left in the river (ecological flow). */
  riverFlow: number
  riverRecharge: number
  irrigationReturn: number
  pumping: number
  consumption: number
  /** Water leaving the basin: river water that did not infiltrate, plus aquifer overflow. */
  outflow: number
  groundBefore: number
  groundAfter: number
  stress: number
  stressBand: StressBand
  /** Stress under the same coverage if no technology were installed. */
  stressWithoutTechnology: number
  purchased: Technology[]
  owned: Owned
  creditsAfter: number
  rules: Rule[]
}

export interface GameSummary {
  finalGround: number
  groundChange: number
  totalPumping: number
  totalRecharge: number
  /** Lowest coverage of any sector in any year. */
  worstCoverage: number
  meanCoverage: PerSector
  meanStress: number
  owned: Owned
}
