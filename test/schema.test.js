import test from 'blue-tape'

import schemaTests from './schemas/basic.json'
import validateData from '../lib'

test('Initialized hook', (assert) => {
  const hook = validateData({})
  assert.equal(typeof hook, 'function', 'should be a function')
  assert.end()
})

test('Executed hook with valid data', (assert) => {
  const executeHook = validateData(schemaTests.schema)
  const hook = {
    data: schemaTests.tests.valid.data,
    params: {}
  }

  executeHook(hook)

  assert.ok(hook.params.validated, 'should mark as valid data')
  assert.end()
})

test('Executed hook with invalid data', (assert) => {
  const executeHook = validateData(schemaTests.schema)
  const hook = {
    data: schemaTests.tests.invalid.data,
    params: {}
  }

  try {
    executeHook(hook)
  } catch (err) {
    assert.notOk(hook.params.validated, 'should mark as invalid data')
    assert.ok(err instanceof Error, 'should throw an error')
    assert.ok(err.errors && Array.isArray(err.errors), 'should contain errors array')
    assert.end()
  }
})
