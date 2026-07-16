import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('record step does not bulk auto-assign bag tokens', () => {
  const { source } = loadSubject('src/ui/setup/steps/RecordStep.tsx')
  assert.equal(/for\s*\(.*of\s*players[\s\S]*assignRole/.test(source), false)
  assert.equal(/tokens\.pop\(/.test(source), false)
  assert.match(source, /onAssign/)
})
