import { Pipe } from '@angular/core'
import type { PipeTransform } from '@angular/core'
import { fmt } from '../../tutor/labels'

/** The tutor's number format, so the screen and the tutor always agree (Art. 5.8). */
@Pipe({ name: 'fmt' })
export class FmtPipe implements PipeTransform {
  transform(value: number, decimals = 1): string {
    return fmt(value, decimals)
  }
}
