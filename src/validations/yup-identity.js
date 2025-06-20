import { object, string, number, date, ref } from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const registerSchema = object({
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
  const { identity, confirmPassword,...rest } = value;
  let result = emailRegex.test(identity) ? { email: identity } : { mobile: identity }
  return { ...rest, ...result, identity }
})

let data = {
  firstName: 'andy',
  lastName: 'codecamp',
  // identity : 'andy@cc20.th',
  identity: '1234567890',
  password: '123456',
  confirmPassword: '123456',
}

registerSchema.validate(data, { abortEarly: false })
  .then(rs => {
    console.log('PASS with : ', rs)
  }).catch(err => {
    for (let e of err.inner) {
      console.log(`Error item => ${e.path} : ${e.errors[0]}`)
    }
    console.log('---------------')
    // console.log(err)
  })