import { InjectionToken } from '@angular/core'
import { DEFAULT_PARAMS, DEFAULT_SCENARIO } from '../../engine/params'
import type { Params, Scenario } from '../../engine/types'

/** Model parameters; tests can provide others (ADR 005). */
export const PARAMS = new InjectionToken<Params>('PARAMS', {
  providedIn: 'root',
  factory: () => DEFAULT_PARAMS,
})

/** Years of the game; tests can provide a shorter scenario. */
export const SCENARIO = new InjectionToken<Scenario>('SCENARIO', {
  providedIn: 'root',
  factory: () => DEFAULT_SCENARIO,
})
