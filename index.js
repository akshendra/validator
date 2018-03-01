
const joi = require('joi');
const misc = require('misc');

const j = joi.extend({
  base: joi.string(),
  name: 'custom',
  language: {
    objectId: 'should be an objectId',
  },
  rules: [{
    name: 'objectId',
    validate(params, value, state, options) {
      if (misc.isValidObjectId(value) === false) {
        return this.createError('custom.objectId', {
          v: value,
        }, state, options);
      }
      return value;
    },
  }],
}, {
  base: joi.object(),
  name: 'mongo',
  language: {
    bson: 'Should be an instance of ObjectId',
  },
  rules: [{
    name: 'bson',
    validate(params, value, state, options) {
      if (misc.isValidObjectIdInstance(value)) {
        return this.createError('mongo.bson', {
          v: value,
        }, state, options);
      }
      return value;
    },
  }],
});

const schemas = {
  string: j.string(),
  stringReq: j.string().required(),
  objectId: j.custom().objectId(),
  objectIdReq: j.custom().objectId().required(),
  number: j.number(),
  numberReq: j.number().required(),
  date: j.date(),
  dateReq: j.date().required(),
  keys: j.object().keys.bind(j),
  bool: j.bool(),
  boolReq: j.bool().required(),
};

module.exports = {
  /**
   * Takes a value and a schema to validate the object with
   * @param  {Object} object -> object to validate
   * @param  {Object} schema -> validation schema
   * @return {Boolean} -> true if all the validation passed successfully
   * @throws {QError} -> type validation
   */
  validate(value, schema) {
    const result = j.validate(value, schema);
    if (result.error) {
      throw result.error;
    }
    return result.value;
  },

  joi: j,
  schemas,
};
