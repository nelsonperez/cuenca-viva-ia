import { describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { ɵZONELESS_ENABLED as ZONELESS_ENABLED } from '@angular/core'
import { appConfig } from './app.config'

describe('appConfig', () => {
  it('[constitución 5.2] runs without zone.js', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers })
    expect(TestBed.inject(ZONELESS_ENABLED)).toBe(true)
    expect(typeof (globalThis as { Zone?: unknown }).Zone).toBe('undefined')
  })
})
