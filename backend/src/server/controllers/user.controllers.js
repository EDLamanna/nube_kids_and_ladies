import {
  findUserByEmail,
  getPerfilCompletoById,
  getRegiones,
  getComunas,
  actualizarPerfil,
  createUsuario,
  verificarCredenciales
} from '../models/users.models.js'
import { jwtSign } from '../../../utils/auth/jwt.js'
import db from '../database/db_connect.js'

// Controlador para el inicio de sesión
export const loginController = async (req, res) => {
  const { email, contraseña } = req.body

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Por favor, proporcione email y contraseña' })
  }

  try {
    // Convierte el email a minúsculas antes de buscarlo en la base de datos
    const normalizedEmail = email.toLowerCase()

    // Busca al usuario por su email utilizando `findUserByEmail`
    const usuario = await findUserByEmail(normalizedEmail)

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }

    // Verifica las credenciales utilizando la función
    const isMatch = await verificarCredenciales(normalizedEmail, contraseña)

    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }

    // Define el rol del usuario
    const role = usuario.role === 1 ? 'admin' : 'usuario'

    // Generar el token JWT, incluyendo el email, rol e id del usuario
    const token = jwtSign({ email: usuario.email, role, id: usuario.id })

    // Retorna el token al cliente
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error en el inicio de sesión:', error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

// Obtener el perfil del usuario autenticado
export const getPerfilController = async (req, res) => {
  try {
    const userId = req.params.id

    const perfil = await getPerfilCompletoById(userId)

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil no encontrado' })
    }

    res.status(200).json(perfil)
  } catch (error) {
    console.error('Error al obtener el perfil:', error)
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

// Controlador para obtener regiones
export const getRegionesController = async (req, res) => {
  try {
    const regiones = await getRegiones()
    res.status(200).json(regiones)
  } catch (error) {
    console.error('Error al obtener las regiones:', error)
    res.status(500).json({ message: 'Error al obtener las regiones' })
  }
}

// Controlador para obtener comunas
export const getComunasController = async (req, res) => {
  try {
    const comunas = await getComunas()
    res.status(200).json(comunas)
  } catch (error) {
    console.error('Error al obtener las comunas:', error)
    res.status(500).json({ message: 'Error al obtener las comunas' })
  }
}

// Controlador para actualizar el perfil del usuario autenticado
export const actualizarPerfilController = async (req, res) => {
  const userId = req.params.id
  const perfilActualizado = req.body

  try {
    const result = await actualizarPerfil(userId, perfilActualizado)

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', data: result.rows[0] })
  } catch (error) {
    console.error('Error al actualizar el perfil:', error)
    res.status(500).json({ message: 'Error al actualizar el perfil' })
  }
}

// Controlador para registrar un nuevo usuario
export const createUsuarioController = async (req, res) => {
  const usuarioData = req.body

  try {
    // Convierte el email ingresado a minúsculas antes de hacer cualquier operación
    const normalizedEmail = usuarioData.email.toLowerCase()

    // Verifica si el email ya está en uso
    const existingUserQuery = 'SELECT id FROM usuarios WHERE email = $1'
    const existingUser = await db(existingUserQuery, [normalizedEmail])

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: 'El email ya está en uso' })
    }

    // Actualiza el email del usuarioData con el correo en minúsculas
    usuarioData.email = normalizedEmail

    // Crear el nuevo usuario
    const newUser = await createUsuario(usuarioData)

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: newUser
    })
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message })
  }
}
