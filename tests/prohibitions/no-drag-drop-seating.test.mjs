import assert from 'node:assert/strict'
import test from 'node:test'
import { loadSubject } from './_subject.mjs'

test('players step has no drag-and-drop or add-player sheet seating', () => {
  const { source } = loadSubject('src/ui/setup/steps/PlayersStep.tsx')
  assert.equal(
    /DndContext|useDrag|drag-and-drop|SortableContext|Vaul|Drawer/i.test(source),
    false,
  )
})
