import createErrorUtil from "../utils/create-error.util.js"

export function register(req, res) {
  req.send('Register Controller')
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