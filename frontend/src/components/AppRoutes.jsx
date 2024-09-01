import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from '../view/Home.jsx'
import LoginForm from '../view/LoginForm.jsx'
import RegisterForm from '../view/RegisterForm.jsx'
import BuyCar from '../view/BuyCar.jsx'
import NavBar from './NavBar.jsx'
import Store from './Store.jsx'
import ProductDetail from './ProductDetail.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import MiPerfil from '../view/MiPerfil.jsx'
import Favorites from '../view/Favorites.jsx'
import MisPedidos from '../view/MisPedidos.jsx'
import Ventas from '../view/Ventas.jsx'
import CrearPublicacion from '../view/CrearPublicacion.jsx'

const AppRoutes = () => {
  const location = useLocation()
  const state = location.state || {}
  const backgroundLocation = state.backgroundLocation
  const { authChecked } = useContext(AuthContext) // Obtiene el estado de verificación

  if (!authChecked) {
    return <div>Loading...</div>
  }

  return (
    <>
      <NavBar />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<Home />} />
        <Route path='/tienda/mujer' element={<Store category='mujer' />} />
        <Route path='/tienda/nina' element={<Store category='niña' />} />
        <Route path='/tienda/:productoId' element={<ProductDetail />} />
        <Route
          path='/mi_perfil'
          element={
            <PrivateRoute>
              <MiPerfil />
            </PrivateRoute>
          }
        />
        <Route
          path='/mis_favoritos'
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route
          path='/mis_pedidos'
          element={
            <PrivateRoute>
              <MisPedidos />
            </PrivateRoute>
          }
        />
        <Route
          path='/ventas_realizadas'
          element={
            <PrivateRoute>
              <Ventas />
            </PrivateRoute>
          }
        />
        <Route
          path='/crear_publicacion'
          element={
            <PrivateRoute>
              <CrearPublicacion />
            </PrivateRoute>
          }
        />
        <Route
          path='/carrito'
          element={
            <PrivateRoute>
              <BuyCar />
            </PrivateRoute>
          }
        />
      </Routes>

      {state.showModal && (
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
        </Routes>
      )}
    </>
  )
}

export default AppRoutes
