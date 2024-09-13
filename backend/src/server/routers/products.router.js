import express from 'express'
import multer from 'multer'
import { authToken } from '../middleware/auth.middleware.js'
import {
  getAllProductosController,
  getProductosMujerController,
  getProductosNiñaController,
  getProductoByIdController,
  getInfoProductoController,
  createProductoController,
  softDeleteProductoController
} from '../controllers/products.controllers.js'

const router = express.Router()

// Configuración de Multer para manejar la subida temporalmente en el servidor
const upload = multer({ storage: multer.memoryStorage() })

// Ruta para obtener todos los productos
router.get('/tienda', getAllProductosController)

// Ruta para obtener productos para 'Mujer'
router.get('/tienda/mujer', getProductosMujerController)

// Ruta para obtener productos para 'Niña'
router.get('/tienda/nina', getProductosNiñaController)

// Ruta para obtener un producto por su ID
router.get('/tienda/:productoId', getProductoByIdController)

// Ruta para obtener información de productos (tallas y tipos de persona)
router.get('/info_producto', getInfoProductoController)

// Ruta para crear un nuevo producto
router.post('/productos', upload.array('imagenes', 3), createProductoController)

// Ruta para eliminar un producto (solo para administradores)
router.put('/tienda/:productoId', authToken, softDeleteProductoController)

export default router
