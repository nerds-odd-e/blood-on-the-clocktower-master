import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('start night stays enabled with soft-gate override instead of hard disable', () => {
  const { source } = loadSubject('src/ui/setup/steps/RecordStep.tsx')
  assert.equal(
    /Start night[\s\S]{0,200}disabled=\{/.test(source) ||
      /disabled=\{[^}]*\}[\s\S]{0,200}Start night/.test(source),
    false,
  )
  assert.match(source, /Start night/)
  assert.match(source, /Start anyway/)
})
