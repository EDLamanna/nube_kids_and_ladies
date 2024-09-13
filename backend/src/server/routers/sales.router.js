import express from 'express'
import {
  createVentaController,
  getVentasController,
  getAllVentasController
} from '../controllers/sales.controllers.js'

const router = express.Router()

// Ruta para procesar una venta
router.post('/ventas', createVentaController)

// Ruta para obtener los pedidos del usuario autenticado
router.get('/mis_pedidos/:userId', getVentasController)

// Ruta para obtener todas las ventas (solo para administradores)
router.get('/ventas', getAllVentasController)

export default router
