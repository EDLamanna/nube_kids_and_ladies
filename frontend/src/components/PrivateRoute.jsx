import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, authChecked } = useContext(AuthContext)
  const location = useLocation()

  if (!authChecked) {
    // Evita redirigir antes de que la autenticación se haya verificado
    return null
  }

  if (!user) {
    // Si no está autenticado, redirige a la página de inicio de sesión, pero guarda la ubicación actual
    return <Navigate to='/login' state={{ from: location }} />
  }

  // Si está autenticado, renderiza el componente hijo
  return children
}

export default PrivateRoute
