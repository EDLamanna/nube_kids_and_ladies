import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { CartContext } from '../context/CartContext'
import Swal from 'sweetalert2'

const AlertBuyCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      talla: product.tallas[0],
      quantity: 1
    }

    addToCart(productToAdd)

    Swal.fire({
      title: 'Producto agregado al carrito',
      text: `${product.nombre} se ha añadido a tu carrito.`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      position: 'top-end',
      toast: true
    })
  }

  return (
    <FontAwesomeIcon
      icon={faCartShopping}
      className='icon-buy'
      onClick={handleAddToCart}
    />
  )
}

export default AlertBuyCard
