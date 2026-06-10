import assert from 'node:assert/strict'
import test from 'node:test'
import { safeAdminRedirect } from '../src/lib/admin-redirect.mjs'

test('admin redirect accepts only same-origin admin paths', () => {
  assert.equal(safeAdminRedirect('/admin'), '/admin')
  assert.equal(safeAdminRedirect('/admin/rewards?tab=pending'), '/admin/rewards?tab=pending')
  assert.equal(safeAdminRedirect('/admin#stats'), '/admin#stats')

  assert.equal(safeAdminRedirect('https://example.com/admin'), '/admin')
  assert.equal(safeAdminRedirect('//example.com/admin'), '/admin')
  assert.equal(safeAdminRedirect('javascript:alert(1)'), '/admin')
  assert.equal(safeAdminRedirect('/administrator'), '/admin')
  assert.equal(safeAdminRedirect(null), '/admin')
})
