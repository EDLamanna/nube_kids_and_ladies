import React, { useContext, useEffect } from 'react'
import { ProductContext } from '../context/ProductContext.jsx'
import CardProducts from './CardProducts.jsx'

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
            {products.length > 0 &&
              products.map((product) => (
                <CardProducts
                  key={`${product.id}-${product.talla}`}
                  product={product}
                />
              ))}
            {products.length === 0 && <p>No hay productos disponibles.</p>}
          </div>
        )}
      </div>
    </main>
  )
}

export default Store
