import { H3Error } from 'h3';
import Joi, { ValidationError } from 'joi'

export default async function validateData (schema: Joi.Schema, data: Object) {
  const valid = schema.validateAsync(data)
    .then(() => {
      return true;
    })
    .catch((err: ValidationError) => {
      return createError({ data: err.message, statusMessage: 'Validation Error', statusCode: 400 })
    })
  
  return valid
}