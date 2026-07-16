import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('night ready step does not navigate to play', () => {
  const { source } = loadSubject('src/ui/setup/steps/NightReadyStep.tsx')
  assert.equal(/\/play/.test(source), false)
  assert.equal(/navigate\s*\(/.test(source), false)
  assert.equal(/<Link[\s\S]*to=["']\/play/.test(source), false)
})
