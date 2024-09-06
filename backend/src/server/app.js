import express from 'express'
import cors from 'cors'
import multer from 'multer'
import morgan from 'morgan'
import { authToken } from './middleware/auth.middleware.js'
import {
  loginController,
  getPerfilController,
  getAllProductosController,
  getProductosMujerController,
  getProductosNiñaController,
  getProductoByIdController,
  getRegionesController,
  getComunasController,
  actualizarPerfilController,
  createVentaController,
  getVentasController,
  getAllVentasController,
  getInfoProductoController,
  createProductoController,
  softDeleteProductoController,
  createUsuarioController
} from './middleware/controllers.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Configuración de Multer para manejar la subida temporalmente en el servidor
const upload = multer({ storage: multer.memoryStorage() })

// Ruta de bienvenida a la API
app.get('/', (_, res) => {
  res.status(200).json('API operativa')
})

// Ruta de inicio de sesión
app.post('/login', loginController)

// Ruta para obtener el perfil del usuario autenticado
app.get('/mi_perfil/:id', getPerfilController)

// Ruta para obtener todos los productos
app.get('/tienda', getAllProductosController)

// Ruta para obtener productos para 'Mujer'
app.get('/tienda/mujer', getProductosMujerController)

// Ruta para obtener productos para 'Niña'
app.get('/tienda/nina', getProductosNiñaController)

// Ruta para obtener un producto por su ID
app.get('/tienda/:productoId', getProductoByIdController)

// Ruta para obtener regiones
app.get('/regiones', getRegionesController)

// Ruta para obtener comunas
app.get('/comunas', getComunasController)

// Ruta para actualizar el perfil del usuario autenticado
app.put('/mi_perfil/:id', actualizarPerfilController)

// Ruta para procesar una venta
app.post('/ventas', createVentaController)

// Ruta para obtener los pedidos del usuario autenticado
app.get('/mis_pedidos/:userId', getVentasController)

// Ruta para obtener todas las ventas (solo para administradores)
app.get('/ventas', getAllVentasController)

// Ruta para obtener información de productos (tallas y tipos de persona)
app.get('/info_producto', getInfoProductoController)

// Ruta para crear un nuevo producto
app.post('/productos', upload.array('imagenes', 3), createProductoController)

// Ruta para eliminar un producto (solo para administradores)
app.put('/tienda/:productoId', authToken, softDeleteProductoController)

// Ruta para registrar un nuevo usuario
app.post('/register', createUsuarioController)

// Manejo de rutas no encontradas
app.all('*', (req, res) => res.status(404).json({ status: false, message: 'page not found' }))

// Iniciar el servidor
app.listen(PORT, () => {
  const host = process.env.HOST || 'localhost'
  console.log(`Servidor escuchando en http://${host}:${PORT}`)
})

export default app
