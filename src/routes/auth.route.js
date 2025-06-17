import express from 'express'
// import {register, login} from '../controllers/auth.controller.js'
import * as authController from '../controllers/auth.controller.js'
const authRoute = express.Router()

authRoute.post('/register', authController.register)
authRoute.post('/login',authController.login)
authRoute.get('/me', authController.getMe)

export default authRoute