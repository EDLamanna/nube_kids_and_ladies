import bcrypt from 'bcryptjs'

// Función para encriptar una contraseña
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10)
}

// Función para comparar una contraseña con su versión encriptada
export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}
