import { test } from 'node:test'
import assert from 'node:assert/strict'
import { codeFromName, parseCreatorLines } from '../src/lib/trackjump-creators.ts'

test('a code is made from the name when none is given', () => {
  assert.equal(codeFromName('King Dac'), 'KINGDAC')
  assert.equal(codeFromName('Jöran Øst-Hansen'), 'JORANSTHANSE')
})

test('each line gives a name, an upper-case code and an optional email', () => {
  assert.deepEqual(parseCreatorLines('King Dac, dac , Dac@Example.com\n\n  Jane Jumps\nMike Hops;mike-23\t'), [
    { name: 'King Dac', code: 'DAC', email: 'dac@example.com' },
    { name: 'Jane Jumps', code: 'JANEJUMPS', email: '' },
    { name: 'Mike Hops', code: 'MIKE23', email: '' },
  ])
})
