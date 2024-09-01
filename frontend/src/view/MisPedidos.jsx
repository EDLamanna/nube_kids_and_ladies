import React, { useEffect, useState, useContext } from 'react'
import { Table, Container, Spinner } from 'react-bootstrap'
import { URLBASE } from '../config/constant.js'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const MisPedidos = () => {
  const { user, token } = useContext(AuthContext)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('No se pudo obtener la identificación del usuario.')
        }
        const response = await axios.get(`${URLBASE}/mis_pedidos/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPedidos(response.data.pedidos || [])
      } catch (error) {
        setError('Error al cargar los pedidos')
      } finally {
        setLoading(false)
      }
    }

    if (user && token) {
      fetchPedidos()
    }
  }, [user, token])

  useEffect(() => {
  }, [pedidos])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount)
  }

  if (loading) {
    return (
      <Container className='d-flex justify-content-center align-items-center container-pedidos'>
        <Spinner animation='border' />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className='d-flex justify-content-center align-items-center container-pedidos'>
        <p>{error}</p>
      </Container>
    )
  }

  return (
    <main>
      <Container className='app-container'>
        <h1 className='text-center my-4'>Mis pedidos</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Pedido_No</th>
              <th>Producto</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {
              pedidos.length > 0
                ? pedidos.map((pedido, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{pedido.producto}</td>
                    <td>{pedido.talla}</td>
                    <td>{pedido.cantidadVendida}</td>
                    <td>{formatCurrency(pedido.precioUnitario)}</td>
                  </tr>
                ))
                : (
                  <tr>
                    <td colSpan='5' className='text-center'>No hay pedidos disponibles</td>
                  </tr>
                  )
                  }
          </tbody>
        </Table>
      </Container>
    </main>
  )
}

export default MisPedidos
