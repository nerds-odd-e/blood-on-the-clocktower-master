import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('physical bag tokens never include the drunk character id', () => {
  const { source } = loadSubject(
    'tests/prohibitions/fixtures/bag-legal.clean.json',
  )
  const bag = JSON.parse(source)
  assert.ok(Array.isArray(bag.tokens))
  assert.equal(bag.tokens.includes('drunk'), false)
})
