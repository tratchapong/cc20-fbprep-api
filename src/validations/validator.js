import { object, string, number, date, ref } from 'yup';
import createError from '../utils/create-error.util.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

export const registerSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  identity: string()
    .test('Identity check',
      'Invalid Email or Mobile phone',
      value => {
        return emailRegex.test(value) || mobileRegex.test(value)
      }),
  password: string().min(4).required(),
  confirmPassword: string().oneOf([ref("password")], `confirmPassword must match password`)
}).transform((value) => {
  const { identity, confirmPassword, ...rest } = value;
  let result = emailRegex.test(identity) ? { email: identity } : { mobile: identity }
  return { ...rest, ...result, identity }
})

export function validate(schema, options = {}) {
  return async function (req, res, next) {
    try {
      console.log('validate run...')
      const result = await schema.validate(req.body, { abortEarly: false })
      req.body = { ...result }
      if (options.removeIdentity) {
        delete req.body.identity
      }
      next()
    } catch (err) {
      let errMsg = err.errors.join('|||')
      console.log(errMsg)
      // next(errMsg)
      createError(400,errMsg)
    }
  }
}