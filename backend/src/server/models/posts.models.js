import db from '../database/db_connect.js'
import { hashPassword, comparePassword } from '../../../utils/encrypt/bcrytp.js'

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

// consulta para buscar un usuario por su email y obtener también el rol del usuario
export const findUserByEmail = async (email) => {
  try {
    const consulta = `
      SELECT id, email, contraseña, rol_id as role
      FROM usuarios
      WHERE email = $1
    `
    const values = [email]
    const { rows, rowCount } = await db(consulta, values)

    if (rowCount === 0) {
      const newError = { code: 401, message: 'Usuario o contraseña incorrecta' }
      throw newError
    }

    return rows[0]
  } catch (error) {
    const newError = { code: error.code || 500, message: error.message || 'Error al verificar credenciales' }
    throw newError
  }
}

// consulta para obtener el perfil completo de un usuario por su ID
export const getPerfilCompletoById = async (userId) => {
  const query = `
    SELECT
        u.id AS usuario_id,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.fecha_nacimiento,
        u.email,
        ui.direccion,
        ui.nro_calle,
        v.casa_dpto AS vivienda,
        ui.nro_departamento,
        ui.bloque_departamento,
        r.region,
        c.comuna,
        ui.telefono_movil,
        ui.telefono_fijo
    FROM
        usuarios u
    JOIN
        usuario_info ui ON u.id = ui.usuario_id
    JOIN
        vivienda v ON ui.vivienda_id = v.id
    JOIN
        regiones r ON ui.region_id = r.id
    JOIN
        comunas c ON ui.comuna_id = c.id
    WHERE
        u.id = $1
  `

  const values = [userId]
  const { rows } = await db(query, values)
  return rows[0]
}

// consulta para obtener las regiones
export const getRegiones = async () => {
  const query = 'SELECT id, region FROM regiones ORDER BY region ASC'
  const { rows } = await db(query)
  return rows
}

// consulta para obtener las comunas
export const getComunas = async () => {
  const query = `
    SELECT c.id, c.comuna, c.region_id, r.region
    FROM comunas c
    JOIN regiones r ON c.region_id = r.id
    ORDER BY c.comuna ASC
  `
  const { rows } = await db(query)
  return rows
}

// consulta para actualizar un perfil por su Id de usuario
export const actualizarPerfil = async (userId, perfilActualizado) => {
  const {
    direccion,
    nro_calle: nroCalle,
    vivienda_id: viviendaIdTexto,
    nro_departamento: nroDepartamento,
    bloque_departamento: bloqueDepartamento,
    region_id: regionIdTexto,
    comuna_id: comunaIdTexto,
    telefono_movil: telefonoMovil,
    telefono_fijo: telefonoFijo
  } = perfilActualizado

  try {
    // Transacción
    await db('BEGIN')

    // Consulta dinámica para obtener el `vivienda_id`
    const viviendaQuery = 'SELECT id FROM vivienda WHERE casa_dpto = $1'
    const viviendaResult = await db(viviendaQuery, [viviendaIdTexto])
    const viviendaId = viviendaResult.rows[0]?.id

    // Consulta dinámica para obtener el `region_id`
    const regionQuery = 'SELECT id FROM regiones WHERE id = $1'
    const regionResult = await db(regionQuery, [regionIdTexto])
    const regionId = regionResult.rows[0]?.id

    // Consulta dinámica para obtener el `comuna_id`
    const comunaQuery = 'SELECT id FROM comunas WHERE id = $1 AND region_id = $2'
    const comunaResult = await db(comunaQuery, [comunaIdTexto, regionId])
    const comunaId = comunaResult.rows[0]?.id

    // Si cualquiera de los IDs no se encuentra, se debe lanzar un error
    if (!viviendaId || !regionId || !comunaId) {
      console.error('Error al obtener uno de los IDs:', {
        viviendaId,
        regionId,
        comunaId
      })
      throw new Error('Error al obtener los IDs necesarios para la actualización')
    }

    // Consulta de actualización
    const query = `
      UPDATE usuario_info
      SET
        direccion = $1,
        nro_calle = $2,
        vivienda_id = $3,
        nro_departamento = $4,
        bloque_departamento = $5,
        region_id = $6,
        comuna_id = $7,
        telefono_movil = $8,
        telefono_fijo = $9
      WHERE usuario_id = $10
      RETURNING *
    `
    const values = [
      direccion,
      nroCalle,
      viviendaId,
      nroDepartamento,
      bloqueDepartamento,
      regionId,
      comunaId,
      telefonoMovil,
      telefonoFijo,
      userId
    ]

    const result = await db(query, values)
    await db('COMMIT')
    return result
  } catch (error) {
    await db('ROLLBACK')
    console.error('Error al actualizar el perfil:', error)
    throw error
  }
}

// consulta para registrar una venta
export const createVenta = async (userId, ventasDetalles, montoTotal) => {
  try {
    // transacción
    await db('BEGIN')

    // Insertar en la tabla `ventas`
    const ventaQuery = `
      INSERT INTO ventas (usuario_id, fecha_venta, monto_total)
      VALUES ($1, NOW(), $2)
      RETURNING id
    `
    const ventaResult = await db(ventaQuery, [userId, montoTotal])
    const ventaId = ventaResult.rows[0]?.id

    if (!ventaId) {
      throw new Error('Error al crear la venta')
    }

    // Insertar los detalles de la venta en la tabla `ventas_detalles`
    const detalleQuery = `
      INSERT INTO ventas_detalles (venta_id, producto_general_id, talla_id, cantidad_vendida, precio_unitario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `

    for (const detalle of ventasDetalles) {
      const {
        producto_general_id: productoGeneralId,
        talla_id: tallaId,
        cantidad_vendida: cantidadVendida,
        precio_unitario: precioUnitario
      } = detalle

      // Inserta cada detalle en la tabla `ventas_detalles`
      await db(detalleQuery, [
        ventaId,
        productoGeneralId,
        tallaId,
        cantidadVendida,
        precioUnitario
      ])
    }

    // Finaliza la transacción
    await db('COMMIT')

    return { ventaId }
  } catch (error) {
    await db('ROLLBACK')
    console.error('Error al crear la venta:', error)
    throw error
  }
}

// consulta para ver las venta por ID del usuario
export const getVentas = async (userId) => {
  try {
    const ventasQuery = `
      SELECT v.id AS venta_id, vd.producto_general_id, vd.talla_id, vd.cantidad_vendida, vd.precio_unitario, t.talla, p.nombre AS producto
      FROM ventas v
      JOIN ventas_detalles vd ON v.id = vd.venta_id
      JOIN tallas t ON vd.talla_id = t.id
      JOIN productos p ON vd.producto_general_id = p.producto_general_id
      WHERE v.usuario_id = $1
    `

    const ventasResult = await db(ventasQuery, [userId])

    if (ventasResult.rows.length === 0) {
      throw new Error('No se encontraron pedidos para este usuario')
    }

    const pedidos = ventasResult.rows.map(row => ({
      ventaId: row.venta_id,
      producto: row.producto,
      talla: row.talla,
      cantidadVendida: row.cantidad_vendida,
      precioUnitario: row.precio_unitario
    }))

    return pedidos
  } catch (error) {
    console.error('Error al obtener las ventas:', error)
    throw error
  }
}

// consulta para ver todas las venta
export const getAllVentas = async () => {
  try {
    const ventasQuery = `
      SELECT v.id AS venta_id, vd.producto_general_id, vd.talla_id, vd.cantidad_vendida, vd.precio_unitario, t.talla, p.nombre AS producto
      FROM ventas v
      JOIN ventas_detalles vd ON v.id = vd.venta_id
      JOIN tallas t ON vd.talla_id = t.id
      JOIN productos p ON vd.producto_general_id = p.producto_general_id
    `

    const ventasResult = await db(ventasQuery)

    if (ventasResult.rows.length === 0) {
      throw new Error('No se encontraron ventas')
    }

    const ventas = ventasResult.rows.map(row => ({
      ventaId: row.venta_id,
      producto: row.producto,
      talla: row.talla,
      cantidadVendida: row.cantidad_vendida,
      precioUnitario: row.precio_unitario
    }))

    return ventas
  } catch (error) {
    console.error('Error al obtener las ventas:', error)
    throw error
  }
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

// consulta para crear un usuario
export const createUsuario = async (usuarioData) => {
  const {
    rut,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    email,
    contraseña,
    fechaNacimiento,
    direccion = '',
    nroCalle = '',
    viviendaId = 1,
    nroDepartamento = '',
    bloqueDepartamento = '',
    regionId = 1,
    comunaId = 1,
    telefonoMovil = '',
    telefonoFijo = ''
  } = usuarioData

  try {
    // Verifica que el rut no esté vacío o sea nulo
    if (!rut) {
      throw new Error('El RUT no puede estar vacío o indefinido')
    }

    // Hashear la contraseña proporcionada por el usuario
    const passwordEncriptada = await hashPassword(contraseña)

    // Inicia transacción
    await db('BEGIN')

    // Consulta para crear el usuario en la tabla `usuarios`
    const consultaUsuario = `
      INSERT INTO usuarios (id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, rol_id, contraseña)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nombre, email, rol_id
    `
    const valuesUsuario = [rut, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, 2, passwordEncriptada]
    const { rows: usuarioRows, rowCount: usuarioRowCount } = await db(consultaUsuario, valuesUsuario)

    if (usuarioRowCount === 0) {
      throw new Error('No se pudo crear el usuario, por favor intenta más tarde.')
    }

    // Después de crear el usuario, inserta en la tabla usuario_info
    const consultaUsuarioInfo = `
      INSERT INTO usuario_info (
        usuario_id,
        direccion,
        nro_calle,
        vivienda_id,
        nro_departamento,
        bloque_departamento,
        region_id,
        comuna_id,
        telefono_movil,
        telefono_fijo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const valuesUsuarioInfo = [
      rut,
      direccion,
      nroCalle,
      viviendaId,
      nroDepartamento,
      bloqueDepartamento,
      regionId,
      comunaId,
      telefonoMovil,
      telefonoFijo
    ]

    const { rowCount: usuarioInfoRowCount } = await db(consultaUsuarioInfo, valuesUsuarioInfo)

    if (usuarioInfoRowCount === 0) {
      throw new Error('No se pudo poblar la tabla usuario_info, por favor intenta más tarde.')
    }

    // Si todo va bien, finaliza la transacción
    await db('COMMIT')

    return usuarioRows[0]
  } catch (error) {
    // Si ocurre un error, revierte transacción
    await db('ROLLBACK')

    const newError = new Error(error.message)
    newError.code = 500
    throw newError
  }
}

// consulta para verificar las credenciales de un usuario
export const verificarCredenciales = async (email, password) => {
  try {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1'
    const values = [email]
    const { rows, rowCount } = await db(consulta, values)

    if (rowCount === 0) {
      const newError = { code: 401, message: 'Email o contraseña incorrecta' }
      throw newError
    }

    const usuario = rows[0]
    const passwordEncriptada = usuario.contraseña
    const passwordCorrecta = await comparePassword(password, passwordEncriptada)

    if (!passwordCorrecta) {
      const newError = { code: 401, message: 'Email o contraseña incorrecta' }
      throw newError
    }

    return usuario // Retorna el usuario si las credenciales son correctas
  } catch (error) {
    const newError = { code: 500, message: error.message }
    throw newError
  }
}
