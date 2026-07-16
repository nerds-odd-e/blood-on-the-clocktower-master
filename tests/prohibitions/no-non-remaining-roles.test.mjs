import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('role picker only offers remaining bag tokens', () => {
  const { source } = loadSubject('src/ui/setup/components/RolePicker.tsx')
  assert.match(source, /remaining:\s*string\[\]/)
  assert.match(source, /remaining\s*\n?\s*\.map/)
  assert.equal(/roles\.map\(\s*\(role\)\s*=>\s*\(/.test(source), false)
})
