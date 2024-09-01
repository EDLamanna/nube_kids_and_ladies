import React, { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'
import CardProducts from '../components/CardProducts'

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext)

  return (
    <main>
      <div className='favorites'>
        <h1 className='titulo-favoritos'>Mis Favoritos</h1>
        <div className='favorites-grid'>
          {
            favorites.length > 0
              ? (
                  favorites.map(product => (
                    <CardProducts key={product.id} product={product} />
                  ))
                )
              : (
                <p>No tienes productos favoritos.</p>
                )
          }
        </div>
      </div>
    </main>
  )
}

export default Favorites
