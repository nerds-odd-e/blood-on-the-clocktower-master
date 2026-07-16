import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('roster setup does not auto-assign characters', () => {
  const { source } = loadSubject('src/ui/setup/steps/PlayersStep.tsx')
  assert.equal(/assignRole\s*\(/.test(source), false)
})
