import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routers/users.router.js'
import productsRoutes from './routers/products.router.js'
import salesRoutes from './routers/sales.router.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Ruta de bienvenida a la API
app.get('/', (_, res) => {
  res.status(200).json('API operativa')
})

// Rutas para usuarios
app.use('/', userRoutes)

// Rutas para productos
app.use('/', productsRoutes)

// Rutas para ventas
app.use('/', salesRoutes)

// Manejo de rutas no encontradas
app.all('*', (req, res) => res.status(404).json({ status: false, message: 'page not found' }))

// Iniciar el servidor
app.listen(PORT, () => {
  const host = process.env.HOST || 'localhost'
  console.log(`Servidor escuchando en http://${host}:${PORT}`)
})

export default app
