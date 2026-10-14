import { SECTORS, TECHNOLOGIES, TECHNOLOGY_SECTOR } from '../engine/types'
import type { YearResult } from '../engine/types'
import { BAND_NAME, SECTOR_NAME, TECHNOLOGY_NAME, YEAR_NAME, fmt } from './labels'

/**
 * Every number the tutor may mention for a year, including the derived ones.
 * The rule-based tutor and the AI tutor are given this same list.
 */
export function facts(result: YearResult): Record<string, number> {
  const totalRequested = SECTORS.reduce((total, s) => total + result.requested[s], 0)
  const totalDelivered = result.riverUse + result.pumping
  const list: Record<string, number> = {
    year: result.year + 1,
    inflow: result.inflow,
    totalRequested,
    totalDelivered,
    deliveredSharePercent: totalRequested > 0 ? (totalDelivered / totalRequested) * 100 : 100,
    riverUse: result.riverUse,
    pumping: result.pumping,
    riverFlow: result.riverFlow,
    riverRecharge: result.riverRecharge,
    irrigationReturn: result.irrigationReturn,
    totalRecharge: result.riverRecharge + result.irrigationReturn,
    groundBefore: result.groundBefore,
    groundAfter: result.groundAfter,
    groundChange: Math.abs(result.groundAfter - result.groundBefore),
    stress: result.stress,
    stressWithoutTechnology: result.stressWithoutTechnology,
    creditsAfter: result.creditsAfter,
  }
  for (const sector of SECTORS) {
    list[`baseDemand.${sector}`] = result.baseDemand[sector]
    list[`demand.${sector}`] = result.demand[sector]
    list[`delivered.${sector}`] = result.delivered[sector]
    list[`coveragePercent.${sector}`] = result.coverage[sector] * 100
  }
  return list
}

const NUMBER = /\d+(?:,\d+)?/g

/** Numbers in the text that do not match any fact, at any of the precisions the tutor uses. */
export function ungroundedNumbers(text: string, known: Record<string, number>): string[] {
  const allowed = new Set<string>()
  for (const value of Object.values(known)) {
    if (!Number.isFinite(value)) continue
    for (const decimals of [0, 1, 2]) allowed.add(fmt(value, decimals))
  }
  return (text.match(NUMBER) ?? []).filter((found) => !allowed.has(found))
}

const list = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`

/** What happened in a simulated year, most important consequence last. */
export function explainYear(result: YearResult): string[] {
  const f = facts(result)
  const lines: string[] = []
  const has = (rule: YearResult['rules'][number]) => result.rules.includes(rule)

  lines.push(
    `Año ${fmt(f.year, 0)}, ${YEAR_NAME[result.yearType]}: el río trajo ${fmt(f.inflow)} UE de agua.`,
  )

  for (const technology of result.purchased) {
    const sector = TECHNOLOGY_SECTOR[technology]
    lines.push(
      `Instalaste ${TECHNOLOGY_NAME[technology]}: la necesidad de ${SECTOR_NAME[sector]} es ahora de ${fmt(result.demand[sector])} UE en lugar de ${fmt(result.baseDemand[sector])}.`,
    )
  }

  if (!has('pumping')) {
    lines.push(`El río alcanzó para todo lo que pediste (${fmt(f.totalRequested)} UE).`)
  } else {
    lines.push(
      `Pediste ${fmt(f.totalRequested)} UE y el río cubrió ${fmt(f.riverUse)}. El resto, ${fmt(f.pumping)} UE, se bombeó del acuífero.`,
    )
  }

  if (has('proportionalCut')) {
    const cause = has('aquiferExhausted')
      ? 'El acuífero se quedó sin agua para bombear'
      : `El bombeo llegó a su tope (${fmt(f.pumping)} UE)`
    lines.push(
      `${cause}, así que cada sector recibió el ${fmt(f.deliveredSharePercent, 0)} % de lo que pediste.`,
    )
  }

  if (has('riverRecharge')) {
    lines.push(
      `Quedaron ${fmt(f.riverFlow)} UE en el río: ${fmt(f.riverRecharge)} infiltraron en el cono aluvial y recargaron el acuífero.`,
    )
  } else {
    lines.push('No quedó agua en el río, así que su cauce no recargó el acuífero este año.')
  }

  if (result.irrigationReturn > 0) {
    lines.push(
      has('dripReducesReturn')
        ? `Con goteo el riego gasta menos, pero también devuelve menos al acuífero: ${fmt(f.irrigationReturn)} UE.`
        : `El riego devolvió ${fmt(f.irrigationReturn)} UE al acuífero por infiltración.`,
    )
  }

  const change = result.groundAfter - result.groundBefore
  const verb = change > 0 ? 'subió' : change < 0 ? 'bajó' : 'se mantuvo'
  lines.push(
    change === 0
      ? `El acuífero se mantuvo en ${fmt(f.groundAfter)} UE.`
      : `El acuífero ${verb} de ${fmt(f.groundBefore)} a ${fmt(f.groundAfter)} UE (${fmt(f.groundChange)} de diferencia).`,
  )

  const stress = `El estrés hídrico fue ${fmt(f.stress, 2)}, nivel ${BAND_NAME[result.stressBand]}.`
  const installed = TECHNOLOGIES.filter((t) => result.owned[t]).map((t) => TECHNOLOGY_NAME[t])
  lines.push(
    installed.length > 0 && result.stressWithoutTechnology > result.stress
      ? `${stress} Sin ${list(installed)} habría sido ${fmt(f.stressWithoutTechnology, 2)}.`
      : stress,
  )

  return lines
}

export type Tone = 'warning' | 'caution' | 'good'

/** One-sentence warning about the decision being drafted, before simulating. */
export function advise(preview: YearResult): { tone: Tone; text: string } {
  const f = facts(preview)
  const has = (rule: YearResult['rules'][number]) => preview.rules.includes(rule)
  const change = preview.groundAfter - preview.groundBefore

  if (has('proportionalCut')) {
    return {
      tone: 'warning',
      text: `Estás pidiendo más de lo que el río y los pozos pueden dar: cada sector recibiría el ${fmt(f.deliveredSharePercent, 0)} % de lo pedido.`,
    }
  }
  if (change < 0) {
    return {
      tone: 'caution',
      text: `Se bombearían ${fmt(f.pumping)} UE y se recargarían ${fmt(f.totalRecharge)}: el acuífero bajaría ${fmt(f.groundChange)} UE este año.`,
    }
  }
  if (has('riverRecharge')) {
    return {
      tone: 'good',
      text: `Dejás ${fmt(f.riverFlow)} UE en el río. Eso también es gestionar: ${fmt(f.riverRecharge)} recargarían el acuífero, que subiría ${fmt(f.groundChange)} UE.`,
    }
  }
  return {
    tone: 'good',
    text:
      change > 0
        ? `El río alcanza para lo que pedís y el acuífero subiría ${fmt(f.groundChange)} UE por el retorno del riego.`
        : 'El río alcanza para lo que pedís y el acuífero no cambiaría este año.',
  }
}
