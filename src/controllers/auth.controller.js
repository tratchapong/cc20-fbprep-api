import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.config.js'
import createError from "../utils/create-error.util.js"
import checkIdentityKey from "../utils/identity-key.util.js"


export async function register(req, res) {
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
		const findIdentity = await prisma.user.findUnique({
			where: { [identityKey]: identity }
		})
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
		const result = await prisma.user.create({ data: newUser })
		res.json({ msg: `Register successful`, result })
}

export function login(req,res) {
    if(!req.body.identity) {
      createErrorUtil(400, 'identity required')
    }
    res.json({
    msg : 'Login Controller',
    body : req.body
  })
}

export const getMe = (req,res) => {
  res.json({msg : 'GetMe controller'})
}