import {
  createVenta,
  getVentas,
  getAllVentas
} from '../models/sales.models.js'

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
