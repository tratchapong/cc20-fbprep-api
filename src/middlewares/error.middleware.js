export default function (err, req, res, next) {
  console.log('*** Error ***\n', err)
  const statusCode = err.statusCode || 500
	res.status(statusCode).json({error : err.message})
}