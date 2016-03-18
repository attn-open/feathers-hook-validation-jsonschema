'use strict'

import Ajv from 'ajv'
import errors from 'feathers-errors'

const defaults = {
  allErrors: true
}

export default function (schema, options = {}) {
  options = Object.assign({}, defaults, options)

  const ajv = Ajv(options)
  const validate = ajv.compile(schema)

  return (hook) => {
    if (hook.data) {
      hook.params.validated = validate(hook.data)
      if (!hook.params.validated) {
        throw new errors.Unprocessable('Invalid request data', {
          errors: validate.errors
        })
      }
    }
    return hook
  }
}
