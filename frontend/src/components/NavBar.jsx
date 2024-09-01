import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import LoginForm from '../view/LoginForm.jsx'
import Profiles from './Profile.jsx'
import fullLogo from '../assets/imgs/full_logo.png'

const NavBar = () => {
  const { user } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const location = useLocation()

  // Manejar el clic en el carrito, mostrando el modal de inicio de sesión si el usuario no está autenticado
  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowLoginModal(false)
  }

  // Cambiar el color del ícono del carrito dependiendo de si hay productos en el carrito
  const cartIconColor = cart.length > 0 ? 'text-primary' : 'text-white'

  return (
    <>
      <Navbar expand='lg' className='navbar'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img
              className='logo-nav'
              src={fullLogo}
              alt='Logo Nube Kids and Ladies'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarNavDropdown' />
          <Navbar.Collapse id='navbarNavDropdown'>
            <Nav className='me-auto'>
              <Nav.Link as={Link} to='/tienda/mujer' className='text-white'>
                Pijamas Mujer
              </Nav.Link>
              <Nav.Link as={Link} to='/tienda/nina' className='text-white'>
                Pijamas Niña
              </Nav.Link>
            </Nav>
            <Nav className='ms-auto'>
              {user && <Profiles />}
              {!user && (
                <>
                  <Nav.Link
                    as={Link}
                    to='/login'
                    state={{ backgroundLocation: location, showModal: true }}
                    className='text-white'
                  >
                    Iniciar Sesión
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to='/register'
                    state={{ backgroundLocation: location, showModal: true }}
                    className='text-white'
                  >
                    Registrarse
                  </Nav.Link>
                </>
              )}

              {user?.role !== 'admin' && (
                <Nav.Link
                  as={Link}
                  to='/carrito'
                  className={cartIconColor}
                  onClick={handleCartClick}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showLoginModal && <LoginForm handleCloseModal={handleCloseModal} />}
    </>
  )
}

export default NavBar
