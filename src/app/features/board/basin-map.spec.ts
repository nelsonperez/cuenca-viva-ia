import { describe, expect, it } from '@jest/globals'
import { render } from '../../testing/render'
import { BasinMap } from './basin-map'

describe('BasinMap', () => {
  it('[tablero#1] shows the snowmelt, the river water and what each sector gets', async () => {
    const { text } = await render(BasinMap)
    expect(text()).toContain('Deshielo medio')
    expect(text()).toContain('Trae 100 UE este año')
    expect(text()).toContain('Agricultura')
    expect(text()).toContain('60 UE')
    expect(text()).toContain('100 % de su necesidad')
    expect(text()).toContain('No queda agua en el río')
  })

  it('[tablero#2] shows the water left in the river and its recharge as the draft changes', async () => {
    const { text, store, settle } = await render(BasinMap)
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    await settle()
    expect(text()).toContain('Quedan 30 UE en el río: +9 infiltran en el cono aluvial.')
  })
})
