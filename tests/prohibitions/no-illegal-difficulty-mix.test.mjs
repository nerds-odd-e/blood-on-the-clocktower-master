import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('bag builder validates every candidate before returning', () => {
  const { source } = loadSubject('src/domain/bag/buildBag.ts')
  assert.match(source, /validateBag\(/)
  assert.match(source, /export function buildBag/)
})
