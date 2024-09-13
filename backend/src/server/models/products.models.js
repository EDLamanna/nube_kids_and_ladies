import db from '../database/db_connect.js'

// consulta para obtener todos los productos sin filtrar
export const getAllProductos = async () => {
  const query = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio_unitario,
      tp.tipo_de_persona,
      p.tipo_de_persona_id,
      p.producto_general_id,
      p.talla_id,
      t.talla,
      ARRAY_AGG(ip.image_url) AS image_urls
    FROM productos p
    LEFT JOIN tipo_de_persona tp ON p.tipo_de_persona_id = tp.id
    LEFT JOIN tallas t ON p.talla_id = t.id
    LEFT JOIN imagenes_productos ip ON p.producto_general_id = ip.producto_general_id
    WHERE p.is_deleted = FALSE
    GROUP BY
      p.id,
      p.nombre,
      p.descripcion,
      p.precio_unitario,
      tp.tipo_de_persona,
      p.producto_general_id,
      p.talla_id,
      t.talla
  `

  return await db(query)
}

// consulta para obtener productos para 'Mujer'
export const getProductosMujer = async () => {
  const query = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio_unitario,
      p.producto_general_id,
      p.talla_id,
      t.talla,
      tp.tipo_de_persona,
      ip.image_url
    FROM productos p
    JOIN tallas t ON p.talla_id = t.id
    JOIN tipo_de_persona tp ON p.tipo_de_persona_id = tp.id
    LEFT JOIN imagenes_productos ip ON p.producto_general_id = ip.producto_general_id
    WHERE tp.id = 1
      AND p.is_deleted = FALSE
    ORDER BY p.id ASC
  `

  const { rows } = await db(query)

  // Agrupar productos por ID
  const productosMap = {}

  rows.forEach(row => {
    if (!productosMap[row.id]) {
      productosMap[row.id] = {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio_unitario: row.precio_unitario,
        tipo_de_persona: row.tipo_de_persona,
        producto_general_id: rows[0].producto_general_id,
        talla_id: [],
        tallas: [],
        image_urls: []
      }
    }

    if (!productosMap[row.id].talla_id.includes(row.talla_id)) {
      productosMap[row.id].talla_id.push(row.talla_id)
    }

    if (!productosMap[row.id].tallas.includes(row.talla)) {
      productosMap[row.id].tallas.push(row.talla)
    }

    if (row.image_url && !productosMap[row.id].image_urls.includes(row.image_url)) {
      productosMap[row.id].image_urls.push(row.image_url)
    }
  })

  return Object.values(productosMap)
}

// consulta para obtener productos para 'Niña'
export const getProductosNiña = async () => {
  const query = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio_unitario,
      p.producto_general_id,
      p.talla_id,
      t.talla,
      tp.tipo_de_persona,
      ip.image_url
    FROM productos p
    JOIN tallas t ON p.talla_id = t.id
    JOIN tipo_de_persona tp ON p.tipo_de_persona_id = tp.id
    LEFT JOIN imagenes_productos ip ON p.producto_general_id = ip.producto_general_id
    WHERE tp.id = 2
      AND p.is_deleted = FALSE
    ORDER BY p.id ASC
  `

  const { rows } = await db(query)

  // Agrupar productos por ID
  const productosMap = {}

  rows.forEach(row => {
    if (!productosMap[row.id]) {
      productosMap[row.id] = {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio_unitario: row.precio_unitario,
        tipo_de_persona: row.tipo_de_persona,
        producto_general_id: row.producto_general_id,
        talla_id: [],
        tallas: [],
        image_urls: []
      }
    }

    if (!productosMap[row.id].talla_id.includes(row.talla_id)) {
      productosMap[row.id].talla_id.push(row.talla_id)
    }

    if (!productosMap[row.id].tallas.includes(row.talla)) {
      productosMap[row.id].tallas.push(row.talla)
    }

    if (row.image_url && !productosMap[row.id].image_urls.includes(row.image_url)) {
      productosMap[row.id].image_urls.push(row.image_url)
    }
  })

  return Object.values(productosMap)
}

// consulta para obtener productos por ID
export const getProductoById = async (productoId) => {
  const consulta = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.precio_unitario,
      t.talla,
      p.producto_general_id,
      t.id AS talla_id,
      tp.tipo_de_persona,
      ip.image_url
    FROM productos p
    JOIN tallas t ON p.talla_id = t.id
    JOIN tipo_de_persona tp ON p.tipo_de_persona_id = tp.id
    LEFT JOIN imagenes_productos ip ON p.producto_general_id = ip.producto_general_id
    WHERE p.id = $1
  `
  const values = [productoId]
  const { rows } = await db(consulta, values)

  if (rows.length === 0) {
    return null
  }

  const producto = {
    id: rows[0].id,
    nombre: rows[0].nombre,
    descripcion: rows[0].descripcion,
    precio_unitario: rows[0].precio_unitario,
    tipo_de_persona: rows[0].tipo_de_persona,
    tallas: [],
    producto_general_id: [],
    talla_id: [],
    image_urls: []
  }

  // Agupa las tallas, sus ids, producto_general_id e imágenes
  rows.forEach(row => {
    if (!producto.tallas.includes(row.talla)) {
      producto.tallas.push(row.talla)
      producto.talla_id.push(row.talla_id) // Asociamos el id de la talla
    }
    if (row.image_url && !producto.image_urls.includes(row.image_url)) {
      producto.image_urls.push(row.image_url)
    }
    if (!producto.producto_general_id.includes(row.producto_general_id)) {
      producto.producto_general_id.push(row.producto_general_id)
    }
  })

  return producto
}

// consulta para obtener tallas y tipos de persona en una sola consulta
export const getInfoProducto = async () => {
  try {
    const tallasQuery = `
      SELECT id, talla
      FROM tallas
      ORDER BY talla ASC
    `

    const tiposDePersonaQuery = `
      SELECT id, tipo_de_persona
      FROM tipo_de_persona
      ORDER BY tipo_de_persona ASC
    `

    const tallasResult = await db(tallasQuery)
    const tiposDePersonaResult = await db(tiposDePersonaQuery)

    return {
      tallas: tallasResult.rows,
      tiposDePersona: tiposDePersonaResult.rows
    }
  } catch (error) {
    console.error('Error al obtener la información del producto:', error)
    throw error
  }
}

// consulta para crear una publicación (producto)
export const createProducto = async (productoData, imagenes) => {
  const {
    id,
    nombre,
    descripcion,
    tipo_de_persona_id: tipoDePersonaId,
    talla_id: tallaId,
    precio_unitario: precioUnitario
  } = productoData

  try {
    // Transacción
    await db('BEGIN')

    // Insertar el producto en la tabla productos
    const productoQuery = `
      INSERT INTO productos (id, nombre, descripcion, tipo_de_persona_id, talla_id, precio_unitario)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING producto_general_id
    `
    const productoValues = [id, nombre, descripcion, tipoDePersonaId, tallaId, precioUnitario]
    const productoResult = await db(productoQuery, productoValues)

    const productoGeneralId = productoResult.rows[0].producto_general_id

    // Insertar las URLs de las imágenes en la tabla imagenes_productos
    const imagenesQuery = `
      INSERT INTO imagenes_productos (producto_general_id, image_url)
      VALUES ($1, $2)
    `

    for (const imagen of imagenes) {
      const imagenValues = [productoGeneralId, imagen]
      await db(imagenesQuery, imagenValues)
    }

    // Transacción finaliza
    await db('COMMIT')
    return productoGeneralId
  } catch (error) {
    // Transacción revertida
    await db('ROLLBACK')
    console.error('Error al crear el producto:', error)
    throw error
  }
}

// consulta para simular la eliminacion de un producto
export const softDeleteProductoById = async (productoId) => {
  try {
    await db('BEGIN')

    // Actualiza el campo is_deleted a TRUE para marcar el producto como eliminado
    const softDeleteProductoQuery = `
      UPDATE productos
      SET is_deleted = TRUE
      WHERE id = $1
    `
    await db(softDeleteProductoQuery, [productoId])

    // Obtiene las imágenes relacionadas del producto (sin eliminar del repositorio)
    const imageQuery = `
      SELECT image_url
      FROM imagenes_productos ip
      JOIN productos p ON ip.producto_general_id = p.producto_general_id
      WHERE p.id = $1
    `
    await db(imageQuery, [productoId])

    await db('COMMIT')
    return { success: true, message: 'Producto marcado como eliminado correctamente' }
  } catch (error) {
    await db('ROLLBACK')
    console.error('Error al marcar el producto como eliminado:', error)
    throw error
  }
}
