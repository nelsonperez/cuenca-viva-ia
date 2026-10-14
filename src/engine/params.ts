import type { Params, Scenario } from './types'

// Provisional values from the model draft v0.2: chosen so a game shows visible
// differences between strategies, pending scientific review.
export const DEFAULT_PARAMS: Params = {
  groundMax: 200,
  groundInitial: 100,
  demand: { agr: 60, mun: 25, min: 15 },
  riverRecharge: 0.3,
  irrigationReturn: 0.15,
  irrigationReturnDrip: 0.05,
  pumpMax: 50,
  creditsInitial: 2,
  creditsPerYear: 2,
  technologies: {
    drip: { cost: 4, saving: 0.35 },
    leaks: { cost: 2, saving: 0.2 },
    recirc: { cost: 3, saving: 0.6 },
  },
}

export const DEFAULT_SCENARIO: Scenario = {
  years: [
    { type: 'normal', inflow: 100 },
    { type: 'drought', inflow: 60 },
    { type: 'extremeDrought', inflow: 45 },
    { type: 'wet', inflow: 120 },
    { type: 'drought', inflow: 60 },
  ],
}

/** Upper bounds (exclusive) of each stress band; from the last one up is critical. */
export const STRESS_BANDS = { low: 0.8, moderate: 1.0, high: 1.2 } as const
