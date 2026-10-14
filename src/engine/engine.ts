import { STRESS_BANDS } from './params'
import { SECTORS, TECHNOLOGIES, TECHNOLOGY_SECTOR } from './types'
import type {
  BasinState,
  Decision,
  GameSummary,
  Owned,
  Params,
  PerSector,
  Rule,
  Scenario,
  Sector,
  StressBand,
  Technology,
  YearResult,
} from './types'

const EPSILON = 1e-9

const sum = (values: PerSector) => values.agr + values.mun + values.min

const mapSectors = (fn: (sector: Sector) => number): PerSector => ({
  agr: fn('agr'),
  mun: fn('mun'),
  min: fn('min'),
})

export function initialState(params: Params): BasinState {
  return {
    year: 0,
    ground: params.groundInitial,
    credits: params.creditsInitial,
    owned: { drip: false, leaks: false, recirc: false },
  }
}

export function isGameOver(state: BasinState, scenario: Scenario): boolean {
  return state.year >= scenario.years.length
}

/** Demand per sector given the installed technologies. */
export function demandWith(owned: Owned, params: Params): PerSector {
  const demand = { ...params.demand }
  for (const technology of TECHNOLOGIES) {
    if (owned[technology]) {
      demand[TECHNOLOGY_SECTOR[technology]] *= 1 - params.technologies[technology].saving
    }
  }
  return demand
}

/**
 * Applies the purchases that are affordable and not already owned, in the
 * order given, and ignores the rest.
 */
export function purchase(
  state: BasinState,
  buy: Technology[],
  params: Params,
): { owned: Owned; credits: number; purchased: Technology[] } {
  const owned = { ...state.owned }
  let credits = state.credits
  const purchased: Technology[] = []
  for (const technology of buy) {
    const cost = params.technologies[technology].cost
    if (owned[technology] || cost > credits) continue
    owned[technology] = true
    credits -= cost
    purchased.push(technology)
  }
  return { owned, credits, purchased }
}

export function stressBand(stress: number): StressBand {
  if (stress < STRESS_BANDS.low) return 'low'
  if (stress < STRESS_BANDS.moderate) return 'moderate'
  if (stress < STRESS_BANDS.high) return 'high'
  return 'critical'
}

/** River water is used first; the aquifer covers the shortfall up to the pump cap. */
function supply(totalRequested: number, inflow: number, ground: number, params: Params) {
  const riverUse = Math.min(totalRequested, inflow)
  const shortfall = totalRequested - riverUse
  const pumping = Math.min(shortfall, params.pumpMax, ground)
  return { riverUse, pumping, unmet: shortfall - pumping }
}

const stressOf = (extraction: number, inflow: number) =>
  inflow > 0 ? extraction / inflow : extraction > 0 ? Infinity : 0

export function step(
  state: BasinState,
  decision: Decision,
  params: Params,
  scenario: Scenario,
): { state: BasinState; result: YearResult } {
  if (isGameOver(state, scenario)) {
    throw new Error(`Year ${state.year} is past the end of the scenario`)
  }

  const rules: Rule[] = []
  const { type: yearType, inflow } = scenario.years[state.year]

  const { owned, credits, purchased } = purchase(state, decision.buy, params)
  if (purchased.length > 0) rules.push('technologyPurchased')

  const baseDemand = { ...params.demand }
  const demand = demandWith(owned, params)
  const requested = mapSectors((s) => Math.min(demand[s], Math.max(0, decision.requested[s])))
  const totalRequested = sum(requested)

  const { riverUse, pumping, unmet } = supply(totalRequested, inflow, state.ground, params)
  const totalDelivered = riverUse + pumping
  if (pumping > EPSILON) rules.push('pumping')
  if (unmet > EPSILON) {
    rules.push('proportionalCut')
    rules.push(params.pumpMax <= state.ground ? 'pumpCapReached' : 'aquiferExhausted')
  }

  const share = totalRequested > 0 ? totalDelivered / totalRequested : 1
  const delivered = mapSectors((s) => requested[s] * share)
  const coverage = mapSectors((s) => (demand[s] > 0 ? delivered[s] / demand[s] : 1))

  // Undiverted river water runs down the bed; part of it infiltrates in the alluvial fan.
  const riverFlow = inflow - riverUse
  const riverRecharge = params.riverRecharge * riverFlow
  if (riverRecharge > EPSILON) rules.push('riverRecharge')

  const returnFraction = owned.drip ? params.irrigationReturnDrip : params.irrigationReturn
  const irrigationReturn = returnFraction * delivered.agr
  if (owned.drip && delivered.agr > EPSILON) rules.push('dripReducesReturn')

  const groundUncapped = state.ground + riverRecharge + irrigationReturn - pumping
  const groundSpill = Math.max(0, groundUncapped - params.groundMax)
  if (groundSpill > EPSILON) rules.push('groundSpill')

  // Counterfactual: the same share of each sector's need, with no technology.
  const requestedBase = sum(
    mapSectors((s) => (demand[s] > 0 ? (requested[s] / demand[s]) * baseDemand[s] : 0)),
  )
  const base = supply(requestedBase, inflow, state.ground, params)

  const stress = stressOf(totalDelivered, inflow)
  const creditsAfter = credits + params.creditsPerYear

  const next: BasinState = {
    year: state.year + 1,
    ground: groundUncapped - groundSpill,
    credits: creditsAfter,
    owned,
  }

  const result: YearResult = {
    year: state.year,
    yearType,
    inflow,
    baseDemand,
    demand,
    requested,
    delivered,
    coverage,
    riverUse,
    riverFlow,
    riverRecharge,
    irrigationReturn,
    pumping,
    consumption: totalDelivered - irrigationReturn,
    outflow: riverFlow - riverRecharge + groundSpill,
    groundBefore: state.ground,
    groundAfter: next.ground,
    stress,
    stressBand: stressBand(stress),
    stressWithoutTechnology: stressOf(base.riverUse + base.pumping, inflow),
    purchased,
    owned,
    creditsAfter,
    rules,
  }

  return { state: next, result }
}

/**
 * Water in must equal water kept plus water out. Returns the imbalance, which
 * should be zero within floating-point tolerance.
 */
export function balanceError(result: YearResult): number {
  const before = result.groundBefore + result.inflow
  const after = result.groundAfter + result.consumption + result.outflow
  return before - after
}

export type Strategy = (state: BasinState, params: Params) => Decision

export function playGame(
  strategy: Strategy,
  params: Params,
  scenario: Scenario,
): { history: YearResult[]; finalState: BasinState } {
  let state = initialState(params)
  const history: YearResult[] = []
  while (!isGameOver(state, scenario)) {
    const stepped = step(state, strategy(state, params), params, scenario)
    history.push(stepped.result)
    state = stepped.state
  }
  return { history, finalState: state }
}

export function summarize(history: YearResult[]): GameSummary {
  if (history.length === 0) throw new Error('Cannot summarize an empty game')
  const last = history[history.length - 1]
  const mean = (pick: (r: YearResult) => number) =>
    history.reduce((total, r) => total + pick(r), 0) / history.length
  return {
    finalGround: last.groundAfter,
    groundChange: last.groundAfter - history[0].groundBefore,
    totalPumping: history.reduce((total, r) => total + r.pumping, 0),
    totalRecharge: history.reduce((total, r) => total + r.riverRecharge + r.irrigationReturn, 0),
    worstCoverage: Math.min(...history.flatMap((r) => SECTORS.map((s) => r.coverage[s]))),
    meanCoverage: mapSectors((s) => mean((r) => r.coverage[s])),
    meanStress: mean((r) => r.stress),
    owned: last.owned,
  }
}
