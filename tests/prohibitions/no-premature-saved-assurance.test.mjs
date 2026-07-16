import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('assignments are saved copy is gated on persistWriteStatus saved', () => {
  const { source } = loadSubject('src/ui/setup/steps/NightReadyStep.tsx')
  assert.match(source, /Assignments are saved/)
  assert.match(source, /persistWriteStatus\s*===\s*['"]saved['"]/)
})
