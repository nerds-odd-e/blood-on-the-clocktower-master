import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('bag step does not offer Regenerate or manual bag edit controls', () => {
  const { source } = loadSubject('src/ui/setup/steps/BagStep.tsx')
  assert.equal(/Regenerate/i.test(source), false)
  assert.equal(/manual bag edit/i.test(source), false)
  assert.equal(/contentEditable/i.test(source), false)
})
