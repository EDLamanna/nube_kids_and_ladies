import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { URLBASE } from '../config/constant.js'
import Swal from 'sweetalert2'
import axios from 'axios'

const CrearPublicacion = () => {
  const [codigo, setCodigo] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [generos, setGeneros] = useState([])
  const [tallas, setTallas] = useState([])
  const [generoSeleccionado, setGeneroSeleccionado] = useState('')
  const [tallaSeleccionada, setTallaSeleccionada] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagenes, setImagenes] = useState([])

  useEffect(() => {
    // Cargar tallas y tipos de personas desde el backend
    const fetchInfoProducto = async () => {
      try {
        const response = await axios.get(`${URLBASE}/info_producto`)
        const { tallas, tiposDePersona } = response.data
        setTallas(tallas)
        setGeneros(tiposDePersona)
      } catch (error) {
        Swal.fire('Error', 'Error al cargar los datos del producto', 'error')
      }
    }

    fetchInfoProducto()
  }, [])

  const validarTexto = (texto) => {
    const regex = /^[a-zA-Z0-9\s,.:\-()=?!¿¡ñÑ%/áéíóúÁÉÍÓÚüÜ*]*$/
    return regex.test(texto)
  }

  const handleCodigoChange = (e) => {
    const nuevoValor = e.target.value
    if (validarTexto(nuevoValor)) {
      setCodigo(nuevoValor)
    } else {
      Swal.fire('Error', 'No se permiten caracteres especiales no autorizados en el código', 'error')
    }
  }

  const handleTituloChange = (e) => {
    const nuevoValor = e.target.value
    if (validarTexto(nuevoValor)) {
      setTitulo(nuevoValor)
    } else {
      Swal.fire('Error', 'No se permiten caracteres especiales no autorizados en el título', 'error')
    }
  }

  const handleDescripcionChange = (e) => {
    const nuevoValor = e.target.value
    if (nuevoValor === '' || validarTexto(nuevoValor)) {
      if (nuevoValor.length <= 255) {
        setDescripcion(nuevoValor)
      } else {
        Swal.fire('Error', 'La descripción no debe superar los 255 caracteres', 'error')
      }
    } else {
      Swal.fire('Error', 'Caracteres no permitidos en la descripción', 'error')
    }
  }

  const handlePrecioChange = (e) => {
    const valor = e.target.value
    if (!isNaN(valor) && valor >= 0) {
      setPrecio(valor)
    } else {
      Swal.fire('Error', 'El precio debe ser un número positivo', 'error')
    }
  }

  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files)
    const nombresImagenesExistentes = imagenes.map(img => img.file.name)

    for (const file of files) {
      if (nombresImagenesExistentes.includes(file.name)) {
        Swal.fire('Error', `El nombre de la imagen '${file.name}' ya ha sido seleccionado`, 'error')
        return
      }
    }

    if (imagenes.length + files.length > 3) {
      Swal.fire('Error', 'Solo se pueden subir un máximo de 3 imágenes', 'error')
    } else {
      const nuevasImagenes = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setImagenes(prevImagenes => [...prevImagenes, ...nuevasImagenes])
    }
  }

  const eliminarImagen = (index) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index)
    setImagenes(nuevasImagenes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !codigo ||
      !titulo ||
      !descripcion ||
      !generoSeleccionado ||
      !tallaSeleccionada ||
      !precio ||
      imagenes.length === 0
    ) {
      Swal.fire('Error', 'Debe completar todos los campos antes de crear la publicación', 'error')
      return
    }

    // Crear un objeto FormData
    const formData = new FormData()
    formData.append('id', codigo)
    formData.append('nombre', titulo)
    formData.append('descripcion', descripcion)
    formData.append('tipo_de_persona_id', generoSeleccionado)
    formData.append('talla_id', tallaSeleccionada)
    formData.append('precio_unitario', precio)

    // Agregar las imágenes al FormData
    imagenes.forEach((img) => {
      formData.append('imagenes', img.file)
    })

    try {
      // Enviar los datos al backend
      const response = await axios.post(`${URLBASE}/productos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        Swal.fire('Éxito', 'Publicación creada exitosamente', 'success')
      } else {
        Swal.fire('Error', 'Hubo un problema al crear la publicación', 'error')
      }
    } catch (error) {
      Swal.fire('Error', 'Error al crear la publicación', 'error')
    }
  }

  return (
    <Container className='my-4'>
      <h1 className='text-center'>Crear Publicación</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formCodigo'>
              <Form.Label>Código</Form.Label>
              <Form.Control
                type='text'
                placeholder='Código del producto'
                value={codigo}
                onChange={handleCodigoChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formTitulo'>
              <Form.Label>Título del producto</Form.Label>
              <Form.Control
                type='text'
                placeholder='Título del producto'
                value={titulo}
                onChange={handleTituloChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className='mb-3' controlId='formDescripcion'>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Descripción'
            value={descripcion}
            onChange={handleDescripcionChange}
            required
          />
          <Form.Text className='text-muted'>
            Máximo 255 caracteres.
          </Form.Text>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formGenero'>
              <Form.Label>Mujer o Niña</Form.Label>
              <Form.Select
                value={generoSeleccionado}
                onChange={(e) => setGeneroSeleccionado(e.target.value)}
                required
              >
                <option value=''>Seleccionar</option>
                {generos.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.tipo_de_persona}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formTalla'>
              <Form.Label>Talla</Form.Label>
              <Form.Select
                value={tallaSeleccionada}
                onChange={(e) => setTallaSeleccionada(e.target.value)}
                required
              >
                <option value=''>Seleccionar</option>
                {tallas.map((talla) => (
                  <option key={talla.id} value={talla.id}>
                    {talla.talla}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formPrecio'>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type='number'
                placeholder='Precio'
                value={precio}
                onChange={handlePrecioChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='formImagenes'>
              <Form.Label>Subir Imágenes</Form.Label>
              <Form.Control
                type='file'
                accept='image/*'
                multiple
                onChange={handleImagenesChange}
              />
              {imagenes.length > 0 && (
                <Row className='mt-3'>
                  {imagenes.map((img, index) => (
                    <Col key={index} xs={4} className='mb-3'>
                      <div className='image-preview'>
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className='image-preview'
                        />
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => eliminarImagen(index)}
                          className='mt-2'
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              <Form.Text className='text-muted'>
                Solo se puede subir un máximo de 3 imágenes.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Button variant='primary' type='submit'>
            Crear Publicación
          </Button>
        </Row>
      </Form>
    </Container>
  )
}

export default CrearPublicacion
