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
  confirmPassword: string().oneOf([ref("password")], `confirmPassword must match password`),
  email: string().email(),
  mobile: string().matches(mobileRegex)
}).noUnknown()
.transform((value) => {
  return ({ ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile'] : value.identity })
})

export function validate(schema, options = {}) {
  return async function (req, res, next) {
    try {
      const cleanBody = await schema.validate(req.body,
         { abortEarly: false, ...options })
      req.body = cleanBody
      next()
    } catch (err) {
      let errMsg = err.errors.join('|||')
      console.log(errMsg)
      createError(400,errMsg)
    }
  }
}