import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // eslint-disable-next-line no-undef
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    // eslint-disable-next-line no-undef
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id && item.talla === product.talla
      )

      if (existingProduct) {
        // Si el producto ya existe en el carrito, incrementa su cantidad
        return prevCart.map((item) =>
          item.id === product.id && item.talla === product.talla
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            producto_general_id: product.producto_general_id || null,
            talla_id: product.talla_id || null
          }
        ]
      }
    })
  }

  const updateQuantity = (productId, talla, quantity) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, elimina el producto del carrito
        return prevCart.filter((item) => !(item.id === productId && item.talla === talla))
      } else {
        // De lo contrario, actualiza la cantidad
        return prevCart.map((item) =>
          item.id === productId && item.talla === talla
            ? { ...item, quantity }
            : item
        )
      }
    })
  }

  const removeFromCart = (productId, talla) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.talla === talla))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
