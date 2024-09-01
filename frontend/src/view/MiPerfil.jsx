import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { URLBASE } from '../config/constant.js'
import axios from 'axios'
import Swal from 'sweetalert2'

const MiPerfil = () => {
  const { profile, setProfile } = useContext(AuthContext)
  const [regiones, setRegiones] = useState([])
  const [comunas, setComunas] = useState([])
  const [filteredComunas, setFilteredComunas] = useState([])
  const [showDepartamentoFields, setShowDepartamentoFields] = useState(false)

  const [nroDepartamento, setNroDepartamento] = useState('')
  const [bloqueDepartamento, setBloqueDepartamento] = useState('')

  useEffect(() => {
    if (profile) {
      setShowDepartamentoFields(profile.vivienda_id === 'dpto')
      setNroDepartamento(profile.nro_departamento || '')
      setBloqueDepartamento(profile.bloque_departamento || '')
    }
  }, [profile])

  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        const response = await axios.get(`${URLBASE}/regiones`)
        setRegiones(response.data)
      } catch (error) {
      }
    }

    const fetchComunas = async () => {
      try {
        const response = await axios.get(`${URLBASE}/comunas`)
        setComunas(response.data)
      } catch (error) {
      }
    }

    fetchRegiones()
    fetchComunas()
  }, [])

  useEffect(() => {
    if (profile?.region_id) {
      const comunasFiltradas = comunas.filter(
        (comuna) => comuna.region_id === parseInt(profile.region_id)
      )
      setFilteredComunas(comunasFiltradas)
    }
  }, [profile?.region_id, comunas])

  const handleRegionChange = (e) => {
    const regionId = e.target.value
    const comunasFiltradas = comunas.filter(
      (comuna) => comuna.region_id === parseInt(regionId)
    )
    setFilteredComunas(comunasFiltradas)
  }

  const handleViviendaChange = (e) => {
    const value = e.target.value
    setShowDepartamentoFields(value === 'dpto')

    if (value === 'casa') {
      setNroDepartamento('')
      setBloqueDepartamento('')
    }
  }

  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9\s]+$/
    return regex.test(input)
  }

  const validatePhoneNumber = (phone) => {
    return /^\d{9}$/.test(phone.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const perfilActualizado = {
      direccion: e.target.direccion?.value.trim() || '',
      nro_calle: e.target.nroCalle?.value.trim() || '',
      vivienda_id: e.target.vivienda?.value.toLowerCase() || '',
      nro_departamento: showDepartamentoFields ? nroDepartamento.trim() : '',
      bloque_departamento: showDepartamentoFields ? bloqueDepartamento.trim() : '',
      region_id: e.target.region?.value || '',
      comuna_id: e.target.comuna?.value || '',
      telefono_movil: e.target.telefonoMovil?.value.trim() || '',
      telefono_fijo: e.target.telefonoFijo?.value.trim() || ''
    }

    if (!perfilActualizado.direccion) {
      Swal.fire('Error', 'El campo Dirección es obligatorio.', 'error')
      return
    }
    if (!validateInput(perfilActualizado.direccion)) {
      Swal.fire('Error', 'La Dirección no debe contener caracteres especiales.', 'error')
      return
    }

    if (!perfilActualizado.nro_calle) {
      Swal.fire('Error', 'El campo Número de calle es obligatorio.', 'error')
      return
    }
    if (!validateInput(perfilActualizado.nro_calle)) {
      Swal.fire('Error', 'El Número de calle no debe contener caracteres especiales.', 'error')
      return
    }

    if (!perfilActualizado.vivienda_id) {
      Swal.fire('Error', 'El campo Vivienda es obligatorio.', 'error')
      return
    }

    if (!perfilActualizado.region_id) {
      Swal.fire('Error', 'El campo Región es obligatorio.', 'error')
      return
    }

    if (!perfilActualizado.comuna_id) {
      Swal.fire('Error', 'El campo Comuna es obligatorio.', 'error')
      return
    }

    if (!perfilActualizado.telefono_movil) {
      Swal.fire('Error', 'El campo Número de teléfono móvil es obligatorio.', 'error')
      return
    }
    if (!validatePhoneNumber(perfilActualizado.telefono_movil)) {
      Swal.fire('Error', 'El Número de teléfono móvil debe tener exactamente 9 dígitos.', 'error')
      return
    }

    if (perfilActualizado.telefono_fijo && !validatePhoneNumber(perfilActualizado.telefono_fijo)) {
      Swal.fire('Error', 'El Número de teléfono fijo debe tener exactamente 9 dígitos si se ingresa.', 'error')
      return
    }

    try {
      await axios.put(`${URLBASE}/mi_perfil/${profile.usuario_id}`, perfilActualizado)

      // Actualizar el contexto del perfil
      setProfile(prevProfile => ({
        ...prevProfile,
        ...perfilActualizado // Actualizará el perfil en el contexto con los nuevos datos
      }))

      Swal.fire('Éxito', 'Usuario actualizado exitosamente.', 'success').then(() => {
        window.location.reload()
      })
    } catch (error) {
      Swal.fire('Error', 'Error al actualizar el perfil.', 'error')
    }
  }

  if (!profile) {
    return <p>Cargando perfil...</p>
  }

  return (
    <main>
      <div className='container mt-5 my-5'>
        <h2 className='text-center'>Mi información</h2>
        <Form onSubmit={handleSubmit}>
          <Row className='mb-3'>
            <Col>
              <Form.Group controlId='nombre'>
                <Form.Label>Mi Nombre</Form.Label>
                <h3 className='text-dark'>{profile.nombre}</h3>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='rut'>
                <Form.Label>Mi RUT</Form.Label>
                <h3 className='text-dark'>{profile.usuario_id}</h3>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='direccion' className='mb-3'>
            <Form.Label>Dirección</Form.Label>
            <Form.Control type='text' name='direccion' defaultValue={profile.direccion} required />
          </Form.Group>

          <Row className='mb-3'>
            <Col>
              <Form.Group>
                <Form.Label>Número de calle</Form.Label>
                <Form.Control type='text' name='nroCalle' defaultValue={profile.nro_calle} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Vivienda</Form.Label>
                <Form.Control as='select' name='vivienda' defaultValue={profile.vivienda_id} onChange={handleViviendaChange} required>
                  <option value='casa'>casa</option>
                  <option value='dpto'>dpto</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {showDepartamentoFields && (
            <>
              <Row className='mb-3'>
                <Col>
                  <Form.Group>
                    <Form.Label>Número de Departamento</Form.Label>
                    <Form.Control
                      type='text'
                      id='nroDepto'
                      value={nroDepartamento}
                      onChange={(e) => setNroDepartamento(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Bloque de Departamento</Form.Label>
                    <Form.Control
                      type='text'
                      id='bloqueDepto'
                      value={bloqueDepartamento}
                      onChange={(e) => setBloqueDepartamento(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          <Row className='mb-3'>
            <Col>
              <Form.Group>
                <Form.Label>Región - {profile.region}</Form.Label>
                <Form.Control as='select' name='region' defaultValue={profile.region_id} onChange={handleRegionChange} required>
                  <option value=''>Selecciona una región</option>
                  {regiones.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.region}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Comuna - {profile.comuna}</Form.Label>
                <Form.Control as='select' name='comuna' defaultValue={profile.comuna_id} required>
                  <option value=''>Selecciona una comuna</option>
                  {filteredComunas.map((comuna) => (
                    <option key={comuna.id} value={comuna.id}>
                      {comuna.comuna}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col>
              <Form.Group>
                <Form.Label>Número de teléfono móvil</Form.Label>
                <Row>
                  <Col xs='auto'>
                    <span className='input-group-text'>+56</span>
                  </Col>
                  <Col>
                    <Form.Control type='text' name='telefonoMovil' id='telefonoMovil' defaultValue={profile.telefono_movil} required />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Número de teléfono fijo</Form.Label>
                <Row>
                  <Col xs='auto'>
                    <span className='input-group-text'>+56</span>
                  </Col>
                  <Col>
                    <Form.Control type='text' name='telefonoFijo' id='telefonoFijo' defaultValue={profile.telefono_fijo} />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>

          <Button variant='primary' type='submit' className='w-100'>
            Guardar
          </Button>
        </Form>
      </div>
    </main>
  )
}

export default MiPerfil
