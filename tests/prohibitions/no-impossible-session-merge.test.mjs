import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

const DOWNSTREAM = new Set(['bag', 'deal', 'record', 'nightReady'])

test('persisted session subject never strands downstream steps without a bag', () => {
  const { source, path } = loadSubject(
    'tests/prohibitions/fixtures/session-valid-minimal.clean.json',
  )

  if (path.endsWith('.ts') || path.endsWith('.tsx')) {
    assert.match(source, /assertSetupSessionSemantics/)
    return
  }

  const session = JSON.parse(source)
  if (DOWNSTREAM.has(session.wizardStep)) {
    assert.notEqual(session.bag, null)
  }
})
