import { TestBed } from '@angular/core/testing'
import type { Provider, Type } from '@angular/core'
import { GameStore } from '../core/game.store'

/** Renders a standalone component with the real store and returns helpers for the tests. */
export async function render<T>(component: Type<T>, providers: Provider[] = []) {
  await TestBed.configureTestingModule({ imports: [component], providers }).compileComponents()
  const fixture = TestBed.createComponent(component)
  await fixture.whenStable()
  const element = fixture.nativeElement as HTMLElement
  const store = TestBed.inject(GameStore)
  return {
    fixture,
    element,
    store,
    /** Visible text with collapsed whitespace. */
    text: () => (element.textContent ?? '').replace(/\s+/g, ' '),
    /** Lets the zoneless fixture render after a change. */
    settle: () => fixture.whenStable(),
    simulate: async (times = 1) => {
      for (let i = 0; i < times; i++) store.dispatch({ type: 'simulate' })
      await fixture.whenStable()
    },
  }
}
