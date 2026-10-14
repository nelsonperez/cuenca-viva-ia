// Constitution, Art. 4.1: the domain is plain TypeScript, with no framework,
// no RxJS and no DOM. This test fails if a domain file reaches for any of them.
import { describe, expect, it } from '@jest/globals'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DOMAIN = ['engine']

const FORBIDDEN_IMPORT =
  /(?:from|import|require\s*\()\s*['"]((?:@angular|rxjs|react|react-dom|preact)(?:\/[^'"]*)?)['"]/g
const DOM_GLOBAL = /\b(window|document|localStorage|sessionStorage|navigator)\b(?=\s*[.[(])/g
const COMMENT = /\/\*[\s\S]*?\*\/|\/\/.*$/gm

/** Returns the forbidden references found in a source file. */
export function forbiddenReferences(source: string): string[] {
  const code = source.replace(COMMENT, '')
  return [
    ...Array.from(code.matchAll(FORBIDDEN_IMPORT), (m) => m[1]),
    ...Array.from(code.matchAll(DOM_GLOBAL), (m) => m[1]),
  ]
}

describe('forbiddenReferences', () => {
  it('finds framework and RxJS imports', () => {
    expect(forbiddenReferences("import { signal } from '@angular/core'")).toEqual(['@angular/core'])
    expect(forbiddenReferences("import { map } from 'rxjs/operators'")).toEqual(['rxjs/operators'])
    expect(forbiddenReferences("import { useState } from 'react'")).toEqual(['react'])
  })

  it('finds DOM globals', () => {
    expect(forbiddenReferences('const w = window.innerWidth')).toEqual(['window'])
    expect(forbiddenReferences('document.title = "x"')).toEqual(['document'])
    expect(forbiddenReferences("localStorage.getItem('k')")).toEqual(['localStorage'])
  })

  it('accepts plain domain code', () => {
    expect(forbiddenReferences("import { step } from './engine'\nconst windowSize = 3")).toEqual([])
  })
})

describe('domain boundaries', () => {
  for (const folder of DOMAIN) {
    const dir = join(__dirname, folder)
    const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))

    it.each(files)(`${folder}/%s uses no framework, RxJS or DOM`, (file) => {
      expect(forbiddenReferences(readFileSync(join(dir, file), 'utf8'))).toEqual([])
    })
  }
})
