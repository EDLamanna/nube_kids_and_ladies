import db from '../database/db_connect.js'

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
