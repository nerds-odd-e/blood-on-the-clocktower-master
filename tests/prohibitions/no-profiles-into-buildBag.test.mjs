import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('buildBag input type and callers omit player profile fields', () => {
  const { source } = loadSubject('src/domain/bag/types.ts')
  const inputBlock =
    source.match(/export type BuildBagInput\s*=\s*\{[\s\S]*?\}/)?.[0] ?? source
  assert.equal(/experience/.test(inputBlock), false)
  assert.equal(/\bage\s*:/.test(inputBlock), false)
  assert.equal(/(^|[^a-zA-Z])notes\s*:/.test(inputBlock), false)
  assert.match(inputBlock, /playerCount/)
  assert.match(inputBlock, /difficulty/)
  assert.match(inputBlock, /catalog/)
})
