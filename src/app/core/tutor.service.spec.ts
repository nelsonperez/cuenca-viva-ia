import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { facts, ungroundedNumbers } from '../../tutor/explain'
import { GameStore } from './game.store'
import { TutorService } from './tutor.service'

describe('TutorService', () => {
  let store: GameStore
  let tutor: TutorService

  beforeEach(() => {
    store = TestBed.inject(GameStore)
    tutor = TestBed.inject(TutorService)
  })

  it('[tutor#7] advises on the drafted decision and follows it', () => {
    expect(tutor.advice()?.tone).toBe('good')
    store.dispatch({ type: 'setCoverage', sector: 'agr', value: 50 })
    expect(tutor.advice()?.text).toContain('Dejás')
  })

  it('[tablero#5] explains the last simulated year', () => {
    expect(tutor.lastYear()).toEqual([])
    store.dispatch({ type: 'simulate' })
    expect(tutor.lastYear()[0]).toContain('Año 1')
  })

  it('[tutor#8] never shows a number the engine did not produce', () => {
    for (let year = 0; year < store.totalYears; year++) {
      const known = facts(store.preview()!)
      expect(ungroundedNumbers(tutor.advice()!.text, known)).toEqual([])
      store.dispatch({ type: 'simulate' })
      const last = facts(store.lastYear()!)
      for (const line of tutor.lastYear()) expect(ungroundedNumbers(line, last)).toEqual([])
    }
    expect(tutor.advice()).toBeNull()
  })
})
