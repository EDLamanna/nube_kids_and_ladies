import express from 'express'
import {
  loginController,
  getPerfilController,
  getRegionesController,
  getComunasController,
  actualizarPerfilController,
  createUsuarioController
} from '../controllers/user.controllers.js'

const router = express.Router()

// Ruta de inicio de sesión
router.post('/login', loginController)

// Ruta para obtener el perfil del usuario autenticado
router.get('/mi_perfil/:id', getPerfilController)

// Ruta para obtener regiones
router.get('/regiones', getRegionesController)

// Ruta para obtener comunas
router.get('/comunas', getComunasController)

// Ruta para actualizar el perfil del usuario autenticado
router.put('/mi_perfil/:id', actualizarPerfilController)

// Ruta para registrar un nuevo usuario
router.post('/register', createUsuarioController)

export default router
