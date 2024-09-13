import {
  getProductosMujer,
  getAllProductos,
  getProductosNiña,
  getProductoById,
  getInfoProducto,
  createProducto,
  softDeleteProductoById
} from '../models/products.models.js'
import { uploadImageToGitHub } from '../../../utils/uploadToGitHub.js'

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
