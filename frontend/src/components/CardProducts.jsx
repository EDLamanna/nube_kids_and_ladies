import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FavoritesContext } from '../context/FavoritesContext.jsx'
import { AuthContext } from '../context/AuthContext'
import { URLBASE } from '../config/constant.js'
import AlertBuyCard from './AlertBuyCard.jsx'
import axios from 'axios'
import Swal from 'sweetalert2'

const CardProducts = ({ product }) => {
  const { favorites, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext)
  const { user, token } = useContext(AuthContext) // Obtiene la información del usuario autenticado y el token

  const isFavorite = favorites.some((fav) => fav.id === product.id)

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const handleDeleteClick = async () => {
    try {
      const confirmResult = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      })

      if (confirmResult.isConfirmed) {
        await axios.put(
          `${URLBASE}/tienda/${product.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        Swal.fire(
          'Eliminado!',
          'El producto ha sido marcado como eliminado.',
          'success'
        ).then(() => {
          window.location.reload()
        })
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { useGrouping: true }).format(price)
  }

  return (
    <div className='card'>
      <Link
        className='link-to-tienda'
        to={`/tienda/${product.id}`}
      >
        <div className='card__header'>
          <div className='card__header-item'>
            <img
              className='card__header-img'
              src={product.image_urls[0]}
              alt={product.nombre}
            />
          </div>
          <div className='card__price'>
            <h2 className='card__price-title'>
              <b>$ {formatPrice(product.precio_unitario)}</b>
            </h2>
          </div>
        </div>
        <div className='card__body'>
          <h2 className='card__body-title'>{product.nombre}</h2>
        </div>
      </Link>
      <div className='card__footer'>
        <FontAwesomeIcon
          icon={faHeart}
          className={`icon-like ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
        />
        <AlertBuyCard product={product} />

        {user?.role === 'admin' && (
          <FontAwesomeIcon
            icon={faTrashAlt}
            className='icon-delete'
            onClick={handleDeleteClick}
          />
        )}
      </div>
    </div>
  )
}

export default CardProducts
