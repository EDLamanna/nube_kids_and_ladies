import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Button, Form, Image } from 'react-bootstrap'
import { CartContext } from '../context/CartContext.jsx'
import { URLBASE } from '../config/constant.js'
import axios from 'axios'
import Swal from 'sweetalert2'

const ProductDetail = () => {
  const { productoId } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTalla, setSelectedTalla] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null) // Estado para la imagen seleccionada

  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(
          `${URLBASE}/tienda/${productoId}`
        )
        setProducto(response.data)
        setSelectedTalla(response.data.tallas[0]) // Inicializa con la primera talla que sale en el arreglo del back
        setSelectedImage(response.data.image_urls[0]) // Inicializa con la primera imagen que sale en el arreglo del back
      } catch (err) {
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [productoId])

  const handleAddToCart = () => {
    if (!selectedTalla) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona una talla antes de añadir el producto al carrito.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return
    }

    const tallaIndex = producto.tallas.findIndex(t => t === selectedTalla)
    const tallaId = producto.talla_id[tallaIndex]

    addToCart({
      ...producto,
      talla: selectedTalla,
      talla_id: tallaId,
      producto_general_id: producto.producto_general_id,
      quantity
    })

    Swal.fire({
      title: 'Producto agregado al carrito',
      text: `${producto.nombre} (Talla: ${selectedTalla}) se ha añadido a tu carrito.`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      position: 'top-end',
      toast: true
    })
  }

  if (loading) {
    return <p>Cargando producto...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!producto) {
    return <p>Producto no encontrado</p>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price)
  }

  return (
    <Container className='my-5'>
      <Row>
        <Col md={6} className='mb-4'>
          {selectedImage && (
            <Image src={selectedImage} alt={producto.nombre} fluid />
          )}
          <div className='d-flex justify-content-between mt-3'>
            {producto.image_urls && producto.image_urls.length > 0 && (
              producto.image_urls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${producto.nombre} thumbnail`}
                  thumbnail
                  className='w-25 img-detail'
                  onClick={() => setSelectedImage(url)}
                />
              ))
            )}
          </div>
        </Col>
        <Col md={6}>
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          <h4 className='text-primary'>{formatPrice(producto.precio_unitario)}</h4>
          <Form className='mt-4'>
            <Form.Group controlId='selectTalla'>
              <Form.Label>Talla</Form.Label>
              <Form.Control as='select' value={selectedTalla} onChange={(e) => setSelectedTalla(e.target.value)}>
                {producto.tallas && producto.tallas.length > 0 && (
                  producto.tallas.map((talla, index) => (
                    <option key={index} value={talla}>
                      {talla}
                    </option>
                  ))
                )}
                {(!producto.tallas || producto.tallas.length === 0) && (
                  <option>No disponible</option>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='cantidad' className='mt-3'>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type='number'
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Form.Group>
            <Button variant='primary' className='mt-4' onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ProductDetail
