import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

/** Outline icons on a 24 × 24 grid, drawn with the current text color. */
const ICONS = {
  drop: ['M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z', 'M9 14.5a3 3 0 0 0 3 3'],
  mountain: ['M2 20 9 8l4 6 2.5-3.5L22 20z', 'M7.2 11 9 8l1.8 2.7-1 .8z'],
  river: [
    'M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2',
    'M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2',
    'M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2',
  ],
  agr: [
    'M12 21V9',
    'M12 14c-4 0-6.5-2.5-6.5-6 3.5 0 6.5 2.5 6.5 6z',
    'M12 11c0-4 2.5-6.5 6.5-6.5 0 3.5-2.5 6.5-6.5 6.5z',
  ],
  mun: ['M3 21h18', 'M5 21V10l5-3v14', 'M10 21V4h9v17', 'M13.5 8h2M13.5 12h2M13.5 16h2'],
  min: ['M4 20 13 11', 'M5 6.5C9 3.5 15 3.5 20 7c-3.2.4-5.6 1.5-7.5 3.5C10.5 8.5 8 7.2 5 6.5z'],
  drip: [
    'M3 6h18',
    'M7 6v3M12 6v3M17 6v3',
    'M7 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6zM12 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6zM17 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6z',
    'M3 20h18',
  ],
  wrench: [
    'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  ],
  recycle: [
    'M4 12a8 8 0 0 1 13.7-5.6L20 8.5',
    'M20 3.5v5h-5',
    'M20 12a8 8 0 0 1-13.7 5.6L4 15.5',
    'M4 20.5v-5h5',
  ],
  arrowDown: ['M12 4v14M6 12l6 6 6-6'],
  trendDown: ['M4 7l6 6 4-4 6 6', 'M20 10v5h-5'],
  tutor: [
    'M7 8h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z',
    'M12 4.5V8',
    'M11 3.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
    'M7.8 13.5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0',
    'M13.8 13.5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0',
    'M9.5 17h5',
  ],
  play: ['M7 4.5v15l13-7.5z'],
} satisfies Record<string, string[]>

export type IconName = keyof typeof ICONS

/** Icons drawn as a filled shape instead of an outline. */
const FILLED: ReadonlySet<IconName> = new Set(['play'])

@Component({
  selector: 'app-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      [attr.fill]="filled() ? null : 'none'"
      [attr.stroke]="filled() ? null : 'currentColor'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" [attr.fill]="filled() ? 'currentColor' : null" />
      }
    </svg>
  `,
  host: { class: 'inline-flex shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>()
  readonly size = input(22)

  protected readonly paths = computed(() => ICONS[this.name()])
  protected readonly filled = computed(() => FILLED.has(this.name()))
}
