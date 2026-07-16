import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '../..')

/** Resolve subject under test: GSD_PROHIB_SUBJECT (violation/clean fixture) or default clean path. */
export function loadSubject(defaultRelativePath) {
  const path = process.env.GSD_PROHIB_SUBJECT
    ? resolve(process.cwd(), process.env.GSD_PROHIB_SUBJECT)
    : resolve(repoRoot, defaultRelativePath)
  return { path, source: readFileSync(path, 'utf8') }
}

export function assertNoMatch(source, pattern, message) {
  if (pattern.test(source)) {
    throw new Error(message ?? `Forbidden pattern matched: ${pattern}`)
  }
}
