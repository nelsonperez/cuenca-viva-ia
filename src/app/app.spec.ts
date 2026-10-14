import { describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { App } from './app'

const render = async () => {
  await TestBed.configureTestingModule({ imports: [App] }).compileComponents()
  const fixture = TestBed.createComponent(App)
  await fixture.whenStable()
  return fixture.nativeElement as HTMLElement
}

describe('App', () => {
  it('shows the game name', async () => {
    const page = await render()
    expect(page.querySelector('h1')?.textContent).toContain('Cuenca Viva IA')
  })

  it('[constitución 1.3] always shows that the data is simulated, with the legal note', async () => {
    const page = await render()
    expect(page.textContent).toContain('Datos simulados · Uso educativo')
    expect(page.textContent).toContain('No representa mediciones reales')
  })
})
