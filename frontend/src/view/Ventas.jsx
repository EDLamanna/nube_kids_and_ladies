import React, { useEffect, useState } from 'react'
import { Table, Container, Spinner } from 'react-bootstrap'
import { URLBASE } from '../config/constant.js'
import axios from 'axios'

const Ventas = () => {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get(`${URLBASE}/ventas`)
        setVentas(response.data.ventas || [])
      } catch (error) {
        setError('Error al cargar las ventas')
      } finally {
        setLoading(false)
      }
    }

    fetchVentas()
  }, [])

  useEffect(() => {
  }, [ventas])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount)
  }

  if (loading) {
    return (
      <Container className='d-flex justify-content-center align-items-center container-ventas'>
        <Spinner animation='border' />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className='d-flex justify-content-center align-items-center container-ventas'>
        <p>{error}</p>
      </Container>
    )
  }

  return (
    <main>
      <Container className='app-container'>
        <h1 className='text-center my-4'>Ventas Realizadas</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Venta_No</th>
              <th>Producto</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0
              ? ventas.map((venta, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{venta.producto}</td>
                  <td>{venta.talla}</td>
                  <td>{venta.cantidadVendida}</td>
                  <td>{formatCurrency(venta.precioUnitario)}</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan='5' className='text-center'>No hay ventas disponibles</td>
                </tr>
                )}
          </tbody>
        </Table>
      </Container>
    </main>
  )
}

export default Ventas
