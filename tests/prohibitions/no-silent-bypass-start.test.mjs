import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('start night requires validateAssignments before advancing', () => {
  const { source } = loadSubject('src/ui/setup/steps/RecordStep.tsx')
  assert.match(source, /validateAssignments/)
  assert.match(source, /Start anyway/)
  assert.match(source, /Recording is incomplete/)
})
