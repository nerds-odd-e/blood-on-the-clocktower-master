import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('bag generation call site does not pass experience age or notes', () => {
  const { source } = loadSubject('src/state/setupSessionStore.ts')
  const generateBlock =
    source.match(
      /generateBag:\s*\(\)\s*=>\s*set\(\(state\)\s*=>\s*\{[\s\S]*?\}\),/,
    )?.[0] ?? source
  assert.equal(/experience\s*:/.test(generateBlock), false)
  assert.equal(/age\s*:/.test(generateBlock), false)
  assert.equal(/notes\s*:/.test(generateBlock), false)
  assert.match(generateBlock, /buildBag\(\{/)
  assert.match(generateBlock, /playerCount:/)
  assert.match(generateBlock, /difficulty:/)
  assert.match(generateBlock, /catalog:/)
})
