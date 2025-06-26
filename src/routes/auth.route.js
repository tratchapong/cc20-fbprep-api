import express from 'express'
// import {register, login} from '../controllers/auth.controller.js'
import * as authController from '../controllers/auth.controller.js'
import {registerSchema,loginSchema, validate} from '../validations/validator.js'
import authenticate from '../middlewares/authenticate.middleware.js'
const authRoute = express.Router()

authRoute.post('/register',validate(registerSchema), authController.registerYup)
authRoute.post('/login',validate(loginSchema), authController.login)
authRoute.get('/me',authenticate, authController.getMe)

export default authRoute