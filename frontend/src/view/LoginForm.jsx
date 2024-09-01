import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import ReactDOM from 'react-dom'

function LoginForm ({ handleCloseModal }) {
  const [email, setEmail] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Realiza el login y si es exitoso cierra el modal
      await login(email, contraseña)
      if (typeof handleCloseModal === 'function') {
        handleCloseModal() // Cierra el modal al iniciar sesión exitosamente
      }
      const from = location.state?.from?.pathname || '/'
      navigate(from) // Redirige a la ubicación original o a la página de inicio
    } catch (error) {
      setError('Email o contraseña incorrectos.')
    }
  }

  const handleClose = () => {
    if (typeof handleCloseModal === 'function') {
      handleCloseModal()
    } else {
      navigate(location.state?.backgroundLocation || '/')
    }
  }

  return ReactDOM.createPortal(
    <Modal show handleClose={handleClose} title='Iniciar Sesion'>
      <div className='container mt-5'>
        <h2>Iniciar Sesión</h2>
        {error && <p className='text-danger'>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>Correo Electrónico</label>
            <input
              type='email'
              className='form-control'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='contraseña' className='form-label'>Contraseña</label>
            <input
              type='password'
              className='form-control'
              id='contraseña'
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary'>Iniciar Sesión</button>
        </form>
      </div>
    </Modal>,
    document.getElementById('modal-root')
  )
}

export default LoginForm
