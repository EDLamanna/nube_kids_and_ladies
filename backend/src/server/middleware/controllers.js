import {
  findUserByEmail,
  getProductosMujer,
  getAllProductos,
  getProductosNiña,
  getProductoById,
  getPerfilCompletoById,
  getRegiones,
  getComunas,
  actualizarPerfil,
  createVenta,
  getVentas,
  getAllVentas,
  getInfoProducto,
  createProducto,
  softDeleteProductoById,
  createUsuario,
  verificarCredenciales
} from '../models/posts.models.js'
import { jwtSign } from '../../../utils/auth/jwt.js'
import { uploadImageToGitHub } from '../../../utils/uploadToGitHub.js'
import db from '../database/db_connect.js'

// Controlador para el inicio de sesión
export const loginController = async (req, res) => {
  const { email, contraseña } = req.body

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Por favor, proporcione email y contraseña' })
  }

  try {
    // Busca al usuario por su email utilizando `findUserByEmail`
    const usuario = await findUserByEmail(email)

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }

    // Verifica las credenciales utilizando la función
    const isMatch = await verificarCredenciales(email, contraseña)

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

// Controlador para obtener todos los productos
export const getAllProductosController = async (req, res) => {
  try {
    const productos = await getAllProductos()
    res.status(200).json(productos.rows)
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error al obtener productos', error: error.message })
  }
}

// Controlador para obtener productos para 'Mujer'
export const getProductosMujerController = async (req, res) => {
  try {
    const productos = await getProductosMujer()
    if (productos && productos.length > 0) {
      res.status(200).json(productos)
    } else {
      res.status(404).json({ status: false, message: 'No se encontraron productos para Mujer' })
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error al obtener productos', error: error.message })
  }
}

// Controlador para obtener productos para 'Niña'
export const getProductosNiñaController = async (req, res) => {
  try {
    const productos = await getProductosNiña()
    if (productos && productos.length > 0) {
      res.status(200).json(productos)
    } else {
      res.status(404).json({ status: false, message: 'No se encontraron productos para Niña' })
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error al obtener productos', error: error.message })
  }
}

// Controlador para obtener un producto por su ID
export const getProductoByIdController = async (req, res) => {
  try {
    const { productoId } = req.params

    const producto = await getProductoById(productoId)

    if (producto) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(200).json(producto)
    } else {
      res.status(404).json({ status: false, message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error al obtener el producto', error: error.message })
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

// Controlador para procesar una venta
export const createVentaController = async (req, res) => {
  const userId = req.body.usuario_id
  const ventasDetalles = req.body.detalles
  const montoTotal = req.body.monto_total

  try {
    const result = await createVenta(userId, ventasDetalles, montoTotal)

    res.status(200).json({ message: 'Venta creada correctamente', ventaId: result.ventaId })
  } catch (error) {
    console.error('Error al crear la venta:', error)
    res.status(500).json({ message: 'Error al crear la venta' })
  }
}

// Controlador para obtener los pedidos del usuario autenticado
export const getVentasController = async (req, res) => {
  const userId = req.params.userId
  try {
    const result = await getVentas(userId)
    res.status(200).json({ message: 'Pedidos obtenidos correctamente', pedidos: result })
  } catch (error) {
    console.error('Error al obtener los pedidos:', error)
    res.status(500).json({ message: 'Error al obtener los pedidos' })
  }
}

// Controlador para obtener todas las ventas (solo para administradores)
export const getAllVentasController = async (req, res) => {
  try {
    const result = await getAllVentas()
    res.status(200).json({ message: 'Ventas obtenidas correctamente', ventas: result })
  } catch (error) {
    console.error('Error al obtener las ventas:', error)
    res.status(500).json({ message: 'Error al obtener las ventas' })
  }
}

// Controlador para obtener información de productos (tallas y tipos de persona)
export const getInfoProductoController = async (req, res) => {
  try {
    const infoProducto = await getInfoProducto()
    res.status(200).json(infoProducto)
  } catch (error) {
    console.error('Error al obtener la información del producto:', error)
    res.status(500).json({ message: 'Error al obtener la información del producto' })
  }
}

// Controlador para crear un nuevo producto
export const createProductoController = async (req, res) => {
  const productoData = req.body

  try {
    // Subir las imágenes a GitHub
    const imagenesPromises = req.files.map(async (file) => {
      return await uploadImageToGitHub(file.originalname, file.buffer)
    })

    // Espera a que todas las imágenes se suban y obtén sus URLs
    const imagenes = await Promise.all(imagenesPromises)

    // Crear el producto en la base de datos con las URLs de las imágenes
    const productoGeneralId = await createProducto(productoData, imagenes)

    res.status(200).json({ message: 'Producto creado exitosamente', productoGeneralId })
  } catch (error) {
    console.error('Error al crear el producto:', error)
    res.status(500).json({ message: 'Error al crear el producto', error: error.message })
  }
}

// Controlador para eliminar un producto (solo para administradores)
export const softDeleteProductoController = async (req, res) => {
  const { productoId } = req.params

  // Verificar si el usuario es administrador
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tiene permiso para realizar esta acción' })
  }

  try {
    const result = await softDeleteProductoById(productoId)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar el producto como eliminado', error: error.message })
  }
}

// Controlador para registrar un nuevo usuario
export const createUsuarioController = async (req, res) => {
  const usuarioData = req.body

  try {
    // Verifica si el email ya está en uso
    const existingUserQuery = 'SELECT id FROM usuarios WHERE email = $1'
    const existingUser = await db(existingUserQuery, [usuarioData.email])

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: 'El email ya está en uso' })
    }

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
