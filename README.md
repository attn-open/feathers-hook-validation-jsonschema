# feathers-hook-validation-jsonschema

> Validate Feathers resources using JSON Schema.

## Use

Add the hook into a [Feathers](http://docs.feathersjs.com/hooks/readme.html) flow. Initialize it with either a [JSON Schema](http://json-schema.org) object, or the URL to a schema object. [AJV options](https://github.com/epoberezkin/ajv#options) may be passed as a second parameter during initialization.

```js
  'use strict'

  import { compileSchema as validator, compileSchemaFromUrl as validatorFromUrl } from 'feathers-hook-validation-jsonschema'

  // Initialize a validator with a schema URL.
  const validate = validator({
    title: 'Example Schema',
    type: 'object',
    properties: {
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      age: {
        description: 'Age in years',
        type: 'integer',
        minimum: 0
      }
    },
    required: ['firstName', 'lastName']
  })

  // Initialize a validator with a schema URL.
  const validateFromUrl = validatorFromUrl('https://cdn.rawgit.com/json-schema-org/json-schema-spec/master/schema.json')

  // Add the validator to the Feathers service(s).
  // (Assumes the service has already been initialized.)
  app.service('stuff').before({
    create: [ validate ],
    patch: [ validate ],
    update: [ validate ]
  })

  app.service('things').before({
    create: [ validateFromUrl ],
    patch: [ validateFromUrl ],
    update: [ validateFromUrl ]
  })
```

## Development

This module currently uses the [AJV validation library](https://github.com/epoberezkin/ajv) for the actual validation.
