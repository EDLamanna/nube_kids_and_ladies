import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { URLBASE } from '../config/constant.js'
import axios from 'axios'
import Swal from 'sweetalert2'
import Alert from '../components/Alert.jsx'
import Modal from '../components/Modal.jsx'
import ReactDOM from 'react-dom'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    confirmarEmail: '',
    contraseña: '',
    confirmarContraseña: '',
    fechaNacimiento: ''
  })

  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validate = () => {
    const newErrors = {}
    const rutRegex = /^\d{7,8}-\d{1}$/
    const nameRegex = /^[A-Za-z]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const contraseñaRegex = /^.{8,16}$/

    if (!rutRegex.test(formData.rut)) {
      newErrors.rut = 'El RUT debe tener entre 7 y 8 dígitos seguidos de un guion y 1 dígito verificador.'
    }

    if (!nameRegex.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo debe contener letras.'
    }

    if (!nameRegex.test(formData.apellidoPaterno)) {
      newErrors.apellidoPaterno = 'El apellido paterno solo debe contener letras.'
    }

    if (formData.apellidoMaterno && !nameRegex.test(formData.apellidoMaterno)) {
      newErrors.apellidoMaterno = 'El apellido materno solo debe contener letras.'
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido.'
    }

    if (formData.email !== formData.confirmarEmail) {
      newErrors.confirmarEmail = 'Los correos electrónicos no coinciden.'
    }

    if (!contraseñaRegex.test(formData.contraseña)) {
      newErrors.contraseña = 'La contraseña debe tener entre 8 y 16 caracteres.'
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    try {
      // Enviar solo los campos necesarios al backend
      const { confirmarEmail, confirmarContraseña, ...dataToSend } = formData

      const response = await axios.post(`${URLBASE}/register`, dataToSend)

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Usuario registrado exitosamente.'
        })

        // Borrar los datos del formulario sin redirigir
        setFormData({
          rut: '',
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          email: '',
          confirmarEmail: '',
          contraseña: '',
          confirmarContraseña: '',
          fechaNacimiento: ''
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en el Registro',
          text: response.data.message || 'Hubo un problema con el registro.'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: error.response?.data?.message || 'No se pudo conectar con el servidor. Por favor, inténtelo más tarde.'
      })
      console.error('Error en el registro:', error.response || error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      handleRegister()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el Formulario',
        text: 'Por favor, corrija los errores en el formulario antes de continuar.'
      })
    }
  }

  const closeAlert = () => setAlert({ show: false, message: '', type: '' })

  const handleCloseModal = () => {
    navigate(location.state?.backgroundLocation || '/')
  }

  const view = (
    <>
      <div className='container mt-5'>
        <h2>Registrarse</h2>
        {alert.show && <Alert message={alert.message} type={alert.type} onClose={closeAlert} />}
        <form className='mt-4' onSubmit={handleSubmit}>
          {/* Campos de formulario con validaciones */}
          <div className='mb-3'>
            <label>RUT:</label>
            <input
              type='text'
              className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
              name='rut'
              value={formData.rut}
              onChange={handleChange}
            />
            {errors.rut && <div className='invalid-feedback'>{errors.rut}</div>}
          </div>

          <div className='mb-3'>
            <label>Nombre:</label>
            <input
              type='text'
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <div className='invalid-feedback'>{errors.nombre}</div>}
          </div>

          <div className='mb-3'>
            <label>Apellido Paterno:</label>
            <input
              type='text'
              className={`form-control ${errors.apellidoPaterno ? 'is-invalid' : ''}`}
              name='apellidoPaterno'
              value={formData.apellidoPaterno}
              onChange={handleChange}
            />
            {errors.apellidoPaterno && <div className='invalid-feedback'>{errors.apellidoPaterno}</div>}
          </div>

          <div className='mb-3'>
            <label>Apellido Materno:</label>
            <input
              type='text'
              className={`form-control ${errors.apellidoMaterno ? 'is-invalid' : ''}`}
              name='apellidoMaterno'
              value={formData.apellidoMaterno}
              onChange={handleChange}
            />
            {errors.apellidoMaterno && <div className='invalid-feedback'>{errors.apellidoMaterno}</div>}
          </div>

          <div className='mb-3'>
            <label>Correo Electrónico:</label>
            <input
              type='text'
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
          </div>

          <div className='mb-3'>
            <label>Confirmar Correo Electrónico:</label>
            <input
              type='text'
              className={`form-control ${errors.confirmarEmail ? 'is-invalid' : ''}`}
              name='confirmarEmail'
              value={formData.confirmarEmail}
              onChange={handleChange}
            />
            {errors.confirmarEmail && <div className='invalid-feedback'>{errors.confirmarEmail}</div>}
          </div>

          <div className='mb-3'>
            <label>Contraseña:</label>
            <input
              type='password'
              className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
              name='contraseña'
              value={formData.contraseña}
              onChange={handleChange}
            />
            {errors.contraseña && <div className='invalid-feedback'>{errors.contraseña}</div>}
          </div>

          <div className='mb-3'>
            <label>Repite la Contraseña:</label>
            <input
              type='password'
              className={`form-control ${errors.confirmarContraseña ? 'is-invalid' : ''}`}
              name='confirmarContraseña'
              value={formData.confirmarContraseña}
              onChange={handleChange}
            />
            {errors.confirmarContraseña && <div className='invalid-feedback'>{errors.confirmarContraseña}</div>}
          </div>

          <div className='mb-3'>
            <label>Fecha de Nacimiento:</label>
            <input
              type='date'
              className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
              name='fechaNacimiento'
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
            {errors.fechaNacimiento && <div className='invalid-feedback'>{errors.fechaNacimiento}</div>}
          </div>

          <button type='submit' className='btn btn-primary'>Registrarse</button>
        </form>
      </div>
    </>
  )

  return ReactDOM.createPortal(
    <Modal show handleClose={handleCloseModal} title='Registrarse'>
      {view}
    </Modal>,
    document.getElementById('modal-root')
  )
}

export default RegisterForm
