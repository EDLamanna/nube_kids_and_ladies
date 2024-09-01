import React, { createContext, useState } from 'react'
import axios from 'axios'
import { URLBASE } from '../config/constant.js'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async (category) => {
    try {
      setLoading(true)
      const endpoint = category === 'mujer' ? '/tienda/mujer' : '/tienda/nina'
      const response = await axios.get(`${URLBASE}${endpoint}`)
      setProducts(response.data)
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProductContext.Provider value={{ products, fetchProducts, loading, error }}>
      {children}
    </ProductContext.Provider>
  )
}
