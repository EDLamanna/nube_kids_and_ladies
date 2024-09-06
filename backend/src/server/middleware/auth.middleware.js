import { jwtVerify } from '../../../utils/auth/jwt.js'

export const authToken = (req, res, next) => {
  const authorization = req.header('Authorization')

  if (!authorization) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const [bearer, token] = authorization.split(' ')

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token mal firmado' })
  }

  try {
    req.user = jwtVerify(token) // Decodifica y verifica el token
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido' })
  }
}
