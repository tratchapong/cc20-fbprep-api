import { object, string, number, date, ref } from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const registerSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  identity: string()
    .test('Identity check',
      'Identity must be a valid email or mobile number',
      value => {
        if(!value) { return true }
        return emailRegex.test(value) || mobileRegex.test(value)
      }),
  password: string().min(4).required(),
  confirmPassword: string().oneOf([ref("password")], `confirmPassword must match password`),
  email: string().email(),
  mobile: string().matches(mobileRegex, `invalid mobile phone`)
}).noUnknown()
.transform((value) => {
  if(value.email || value.mobile) {
    delete value.identity 
    return value
  }
  // if have no both email, mobile then transform identity to email or mobile
  return ({ ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile'] : value.identity })
})
.test(
  'require-identity-or-email-or-mobile',
  'At least one of identity, email, or mobile must be provided',
  value => {
    return !!(value.identity || value.email || value.mobile);
  }
)

// console.log(registerSchema)
let data = {
  firstName: 'andy',
  lastName: 'codecamp',
  identity : 'andy@cc20.th',
  // identity: '1234567890',
  password: '123456',
  confirmPassword: '123456',
}

registerSchema.validate(data, { abortEarly: false })
  .then(rs => {
    delete rs.identity
    console.log('PASS with : ', rs)
  }).catch(err => {
    for (let e of err.inner) {
      console.log(`Error item => ${e.path} : ${e.errors[0]}`)
    }
    console.log('---------------')
    // console.log(err)
  })