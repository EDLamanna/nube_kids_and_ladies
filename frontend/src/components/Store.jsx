import React, { useContext, useEffect } from 'react'
import { ProductContext } from '../context/ProductContext.jsx'
import { Link } from 'react-router-dom'

const Store = ({ category }) => {
  const { products, fetchProducts, loading, error } = useContext(ProductContext)

  useEffect(() => {
    fetchProducts(category)
  }, [category])

  return (
    <main>
      <div className='store'>
        <h1 className='titulo-tienda'>
          Catálogo de Pijamas {category === 'mujer' ? 'Mujer' : 'Niñas'}
        </h1>

        {loading && <p>Cargando productos...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && (
          <div className='product-list'>
            {products.length > 0
              ? (
                  products.map((product) => (
                    <div key={`${product.id}-${product.talla}`} className='card'>
                      <Link to={`/tienda/${product.id}`} className='link-to-tienda'>
                        <div className='card__header'>
                          <div className='card__header-item'>
                            <img
                              className='card__header-img'
                              src={product.image_urls[0]} // Mostrar la primera imagen
                              alt={product.nombre}
                            />
                          </div>
                          <div className='card__price'>
                            <h2 className='card__price-title'>
                              <b>$ {product.precio_unitario.toLocaleString()}</b>
                            </h2>
                          </div>
                        </div>
                        <div className='card__body'>
                          <h2 className='card__body-title'>{product.nombre}</h2>
                        </div>
                      </Link>
                    </div>
                  ))
                )
              : (
                <p>No hay productos disponibles.</p>
                )}
          </div>
        )}
      </div>
    </main>
  )
}

export default Store
