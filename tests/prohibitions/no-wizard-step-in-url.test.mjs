import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('setup route table keeps wizard steps out of the URL path', () => {
  const { source } = loadSubject('src/app/routes.tsx')
  assert.equal(/\/setup\/(script|players|difficulty|bag|deal|record|nightReady)/.test(source), false)
  assert.match(source, /path="\/setup"/)
})
