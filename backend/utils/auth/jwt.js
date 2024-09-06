import jwt from 'jsonwebtoken'

const JWTKEY = process.env.JWT_KEY

export const jwtSign = (payload) => jwt.sign(payload, JWTKEY, { expiresIn: '1h' })

export const jwtVerify = (token) => jwt.verify(token, JWTKEY)

export const jwtDecode = (token) => jwt.decode(token, JWTKEY)
