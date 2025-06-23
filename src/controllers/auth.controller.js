import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.config.js'
import createError from "../utils/create-error.util.js"
import checkIdentityKey from "../utils/identity-key.util.js"
import { createUser, getUserBy } from '../services/user.service.js'


export async function register(req, res, next) {
  const { identity, firstName, lastName, password, confirmPassword } = req.body
  // validation
  if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
    createError(400, 'Please fill all data')
  }
  if (password !== confirmPassword) {
    createError(400, 'please check confirm-password ')
  }
  // identity เป็น email หรือ mobile phone number
  const identityKey = checkIdentityKey(identity)
  // หาว่ามี user นี้แล้วหรือยัง
  const findIdentity = await getUserBy(identityKey, identity)
  if (findIdentity) {
    createError(409, `Already have this user : ${identity}`)
  }
  // เตรียมข้อมูล new user + hash password
  const newUser = {
    [identityKey]: identity,
    password: await bcrypt.hash(password, 10),
    firstName: firstName,
    lastName: lastName
  }
  // สร้าง new user ใน database 
  const result = await createUser(newUser)
  res.json({ msg: `Register successful`, result })
}
export async function registerYup(req, res, next) {
  // console.log(req.body)
  const { email, mobile, firstName, lastName, password } = req.body
  // ถ้ามี user แล้วให้แจ้ง eroor 
  if (email && await getUserBy('email', email)) {
    createError(409, `Email: ${email} have already registered`)
  }
  if (mobile && await getUserBy('mobile', mobile)) {
    createError(409, `Mobile: ${mobile} have already registered`)
  }
  // เตรียมข้อมูล new user + hash password
  const newUser = {
    email,
    mobile,
    password: await bcrypt.hash(password, 10),
    firstName: firstName,
    lastName: lastName
  }
  // สร้าง new user ใน database 
  const result = await createUser(newUser)
  res.json({ msg: `Register successful`, result })
}

export async function login(req, res) {
  // console.log(req.body)
  const { identity, password, email, mobile } = req.body
  const identityKey = email ? 'email' : 'mobile'
  // console.log(identityKey)

  // find user
  const foundUser = await getUserBy(identityKey, identity)

  if (!foundUser) {
    createError(401, 'Invalid Login')
  }
  // check password
  let pwOk = await bcrypt.compare(password, foundUser.password)
  if (!pwOk) {
    createError(401, 'Invalid Login')
  }

  // create jwt token

  const payload = { id: foundUser.id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15d'
  })
  const { password: pw, createdAt, updatedAt, ...userData } = foundUser

  res.json({
    msg: 'Login Controller',
    token: token,
    user: userData
  })
}

export const getMe = (req, res) => {
  res.json({ msg: 'GetMe controller' })
}