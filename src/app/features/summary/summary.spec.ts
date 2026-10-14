import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { Summary } from './summary'

/** Cells of the comparison row with the given label. */
const row = (element: HTMLElement, label: string) => {
  const rows = Array.from(element.querySelectorAll('table')[0].querySelectorAll('tbody tr'))
  const found = rows.find((tr) => tr.querySelector('th')!.textContent!.trim() === label)!
  return Array.from(found.querySelectorAll('td')).map((td) => td.textContent!.trim())
}

const again = (element: HTMLElement) =>
  Array.from(element.querySelectorAll('button')).find((b) => b.textContent!.includes('Jugar de nuevo'))!

describe('Summary', () => {
  it('[tablero#6] summarizes the game year by year and offers to play again', async () => {
    const { element, text, store, simulate } = await render(Summary)
    await simulate(5)
    expect(text()).toContain('El acuífero empezó en 100 UE y terminó en 20,5 UE.')
    expect(text()).toContain('Jugá de nuevo con otras decisiones')
    expect(element.querySelectorAll('table')[1].querySelectorAll('tbody tr')).toHaveLength(5)
    again(element).click()
    expect(store.currentYear()).toBe(0)
    expect(store.game().finished).toHaveLength(1)
  })

  it('[tablero#7] compares two games side by side', async () => {
    const { element, text, store, simulate } = await render(Summary)
    await simulate(5)
    store.dispatch({ type: 'restart' })
    store.dispatch({ type: 'toggleBuy', technology: 'leaks' })
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 80 })
    await simulate(5)
    const headers = Array.from(element.querySelectorAll('table')[0].querySelectorAll('thead th'))
    expect(headers.map((th) => th.textContent!.trim())).toEqual(['Indicador', 'Partida anterior', 'Esta partida'])
    expect(row(element, 'Acuífero al final')).toEqual(['20,5 UE', '68,2 UE'])
    expect(row(element, 'Tecnologías instaladas')).toEqual(['ninguna', 'reparación de fugas'])
    expect(text()).toContain('Compará esta partida con la anterior')
  })
})
