import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext.jsx'

const Profiles = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/') // Redirige a la página de inicio después de cerrar sesión
  }

  return (
    <NavDropdown title='Perfil' id='profile-nav-dropdown'>
      {user.role === 'admin' && (
        <>
          <NavDropdown.Item as={Link} to='/crear_publicacion'>
            Crear Publicación
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/ventas_realizadas'>
            Ventas Realizadas
          </NavDropdown.Item>
        </>
      )}

      {user.role !== 'admin' && (
        <>
          <NavDropdown.Item as={Link} to='/mi_perfil'>
            Mi Perfil
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/mis_favoritos'>
            Mis Favoritos
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to='/mis_pedidos'>
            Mis Pedidos
          </NavDropdown.Item>
        </>
      )}
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogout}>
        Cerrar Sesión
      </NavDropdown.Item>
    </NavDropdown>
  )
}

export default Profiles
