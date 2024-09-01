import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import AppRoutes from './components/AppRoutes.jsx'
import Footer from './components/Footer.jsx'

function App () {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <FavoritesProvider>
              <AppRoutes />
              <Footer />
            </FavoritesProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
