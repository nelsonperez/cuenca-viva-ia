import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, viewChild } from '@angular/core'
import { GameStore } from '../../core/game.store'
import { GUIDE_STEPS } from '../../core/guide'
import { HidroBubble } from '../../shared/hidro-bubble'
import { STEP_TEXT, STEP_WAITING } from './steps'

const TARGET = 'guide-target'
const FOCUSABLE = 'input, button:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Hidro's first-year guide. It points at one zone of the board at a time
 * (elements with `data-guide`), without blocking the board.
 */
@Component({
  selector: 'app-guide-overlay',
  imports: [HidroBubble],
  templateUrl: './guide-overlay.html',
  host: { '(document:keydown.escape)': 'store.skipGuide()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideOverlay {
  protected readonly store = inject(GameStore)
  private readonly document = inject(DOCUMENT)
  private readonly gotIt = viewChild<ElementRef<HTMLButtonElement>>('gotIt')

  protected readonly total = GUIDE_STEPS.length

  protected readonly step = computed(() => {
    const index = this.store.guideStep()
    const preview = this.store.preview()
    if (index === null || !preview) return null
    const { zone, advanceOn } = GUIDE_STEPS[index]
    return {
      number: index + 1,
      zone,
      text: STEP_TEXT[zone]({ preview, credits: this.store.creditsLeft() }),
      waiting: advanceOn ? (STEP_WAITING[zone] ?? null) : null,
    }
  })

  constructor() {
    // Syncing with the DOM outside this component: highlight, scroll and focus.
    effect(() => {
      const step = this.step()
      const gotIt = this.gotIt()?.nativeElement
      for (const old of this.document.querySelectorAll(`.${TARGET}`)) old.classList.remove(TARGET)
      if (!step) return
      const targets = Array.from(this.document.querySelectorAll<HTMLElement>(`[data-guide="${step.zone}"]`))
      const target = targets[0]
      if (!target) return
      for (const zone of targets) zone.classList.add(TARGET)
      const reduce = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
      const control = step.waiting
        ? (target.matches(FOCUSABLE) ? target : target.querySelector<HTMLElement>(FOCUSABLE))
        : gotIt
      control?.focus({ preventScroll: true })
    })
  }
}
