import express from 'express'
const authRoute = express.Router()

authRoute.post('/register', (req,res)=>{req.send('Register route')})
authRoute.post('/login',(req, res)=>{
  res.send({
    msg : 'Login route',
    body : req.body
  })
})
authRoute.get('/me', (req,res)=>{res.send('Get me route')})

export default authRoute