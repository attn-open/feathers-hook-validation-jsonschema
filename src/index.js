'use strict'

import Ajv from 'ajv'
import errors from 'feathers-errors'
import fetch from 'node-fetch'

export function compileSchema (schema, options = {}) {
  const defaults = {
    allErrors: true
  }
  const validator = new Promise(function (resolve, reject) {
    const ajv = Ajv(Object.assign({}, defaults, options))
    try {
      resolve(ajv.compile(schema))
    } catch (error) {
      reject(error)
    }
  })

  return initializeHook(validator)
}

export function compileSchemaFromUrl (url, options = {}) {
  const loadSchema = function (url, callback) {
    fetch(url)
      .then((res) => res.json())
      .then((body) => callback(null, body))
      .catch((error) => callback(error))
  }
  const defaults = {
    allErrors: true,
    loadSchema: loadSchema
  }
  const validator = new Promise(function (resolve, reject) {
    const ajv = Ajv(Object.assign({}, defaults, options))

    loadSchema(url, function (error, baseSchema) {
      if (error) {
        reject(error)
      }
      ajv.compileAsync(baseSchema, function (error, compiledValidator) {
        if (error) {
          reject(error)
        }
        return resolve(compiledValidator)
      })
    })
  })

  return initializeHook(validator)
}

function initializeHook (validator) {
  return function (hook) {
    return validator
      .then((validate) => {
        if (hook.data) {
          hook.params.validated = validate(hook.data)
          if (!hook.params.validated) {
            throw new errors.Unprocessable('Invalid request data', {
              errors: validate.errors
            })
          }
        }
        return hook
      })
  }
}
