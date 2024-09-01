import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { URLBASE } from '../config/constant.js'
import Swal from 'sweetalert2'
import axios from 'axios'

const BuyCar = () => {
  const { cart, updateQuantity, clearCart } = useContext(CartContext)
  const { user, token } = useContext(AuthContext)

  const totalPrice = cart.reduce(
    (total, product) => total + product.precio_unitario * product.quantity,
    0
  )

  const handlePayment = async () => {
    if (!user || !token) {
      Swal.fire({
        title: 'No autenticado',
        text: 'Por favor, inicia sesión para proceder con el pago.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
      return
    }

    // Crear el arreglo de detalles de la venta asegurando que talla_id sea un valor único
    const detallesVenta = cart.map((product) => ({
      nombre: product.nombre,
      talla: product.talla,
      talla_id: Array.isArray(product.talla_id) ? product.talla_id[0] : product.talla_id, // Asegurar que es un valor único
      cantidad_vendida: product.quantity,
      precio_unitario: product.precio_unitario,
      producto_general_id: product.producto_general_id
    }))

    // Verificación para asegurar que no haya valores undefined
    for (const detalle of detallesVenta) {
      if (!detalle.producto_general_id || !detalle.talla_id) {
        Swal.fire({
          title: 'Error',
          text: 'Uno o más productos tienen datos faltantes. Por favor, actualiza tu carrito.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        return
      }
    }

    try {
      const venta = {
        usuario_id: user.id,
        monto_total: totalPrice,
        detalles: detallesVenta
      }

      const response = await axios.post(`${URLBASE}/ventas`, venta, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        Swal.fire({
          title: 'Pago procesado',
          text: 'Tu pago se ha realizado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          clearCart()
        })
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al procesar tu pago.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en la solicitud: ${error.response?.data?.message || error.message}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  return (
    <main>
      <div className='bgCarBuy app-container'>
        <div className='carBuyContainer'>
          <h1 className='titleCarBuy'>Mi carrito</h1>
          {cart.map((product) => (
            <div className='productSelectedContainer' key={`${product.id}-${product.talla}`}>
              <img
                className='imgProductSelected'
                src={product.image_urls[0]} // Mostrar la primera imagen
                alt={product.nombre}
              />
              <div className='detailsContainer'>
                <h3 className='nameProduct'>{product.nombre}</h3>
                <p className='sizeProduct'>Talla: {product.talla}</p>
              </div>
              <div className='salesContainer'>
                <p className='netProduct'>
                  ${product.precio_unitario.toLocaleString()}
                </p>
                <button
                  className='btnMinus'
                  onClick={() => updateQuantity(product.id, product.talla, product.quantity - 1)}
                >
                  -
                </button>
                <p>{product.quantity}</p>
                <button
                  className='btnPlus'
                  onClick={() => updateQuantity(product.id, product.talla, product.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <h2>Total: ${totalPrice.toLocaleString()}</h2>
          <button
            className='payBtn'
            onClick={handlePayment}
            disabled={cart.length === 0}
          >
            Ir a pagar
          </button>
        </div>
      </div>
    </main>
  )
}

export default BuyCar
