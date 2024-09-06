import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardProducts from '../components/CardProducts.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faShippingFast, faHeadset } from '@fortawesome/free-solid-svg-icons'
import { URLBASE } from '../config/constant.js'
import isotipo from '../assets/imgs/isotipo.png'
import disney from '../assets/imgs/disney.png'
import sanrio from '../assets/imgs/sanrio.png'
import axios from 'axios'

const Home = () => {
  const [pijamasMujer, setPijamasMujer] = useState([])
  const [pijamasNina, setPijamasNina] = useState([])

  useEffect(() => {
    // Función para obtener los últimos 3 productos de Pijamas Mujer
    const fetchPijamasMujer = async () => {
      try {
        const response = await axios.get(`${URLBASE}/tienda/mujer`)
        setPijamasMujer(response.data.slice(-3))
      } catch (err) {
      }
    }

    // Función para obtener los últimos 3 productos de Pijamas Niña
    const fetchPijamasNina = async () => {
      try {
        const response = await axios.get(`${URLBASE}/tienda/nina`)
        setPijamasNina(response.data.slice(-3))
      } catch (err) {
      }
    }

    fetchPijamasMujer()
    fetchPijamasNina()
  }, [])

  return (
    <main>
      <section className='container mt-5' id='categorias'>
        <div className='row'>
          <div className='col-12 col-md-6 mb-4'>
            <div className='category-card-woman'>
              <h3>Colección Mujer</h3>
              <Link to='/tienda/mujer' className='btn btn-primary me-2'>
                Ver Catálogo
              </Link>
            </div>
          </div>
          <div className='col-12 col-md-6 mb-4'>
            <div className='category-card-little-girl'>
              <h3>Colección Niña</h3>
              <Link to='/tienda/nina' className='btn btn-primary'>
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className='container my-5 brands' id='marcas'>
        <div className='row'>
          <div className='col-12'>
            <div className='desc-brands text-center'>
              <h2>Marcas de calidad y exclusividad</h2>
            </div>
          </div>
          <div className='col-12 mt-4'>
            <div className='d-flex justify-content-center flex-wrap marcas-img'>
              <img
                className='marcas mx-3 my-2'
                src={isotipo}
                alt='Marca Nube Kids & Ladies'
              />
              <img
                className='marcas mx-3 my-2'
                src={disney}
                alt='Marca Disney'
              />
              <img
                className='marcas mx-3 my-2'
                src={sanrio}
                alt='Marca Sanrio'
              />
            </div>
          </div>
        </div>
      </section>

      <section id='catalogo' className='container my-5'>
        <h2 className='text-center mb-4'>Compra con nosotros</h2>
        <div className='row'>
          {pijamasMujer.map((product) => (
            <div className='col-12 col-md-4 mb-4' key={product.id}>
              <CardProducts product={product} />
            </div>
          ))}
        </div>
        <div className='row'>
          {pijamasNina.map((product) => (
            <div className='col-12 col-md-4 mb-4' key={product.id}>
              <CardProducts product={product} />
            </div>
          ))}
        </div>
        <div className='d-flex justify-content-end mt-4'>
          <Link to='/tienda/mujer' className='btn btn-primary me-2'>
            Ver todo Mujer
          </Link>
          <Link to='/tienda/nina' className='btn btn-primary'>
            Ver todo Niña
          </Link>
        </div>
      </section>

      <section className='container my-5'>
        <div className='row'>
          <div className='col-12 col-md-4 d-flex mb-4'>
            <div className='icon-container me-3'>
              <FontAwesomeIcon
                className='iconos-beneficios'
                icon={faCreditCard}
                size='3x'
              />
            </div>
            <div className='text-container'>
              <h5 className='font-weight-bold beneficio-titulo'>PAGO SEGURO</h5>
              <p className='beneficios'>
                Aceptamos cualquier método de pago online
              </p>
            </div>
          </div>
          <div className='col-12 col-md-4 d-flex mb-4'>
            <div className='icon-container me-3'>
              <FontAwesomeIcon
                className='iconos-beneficios'
                icon={faShippingFast}
                size='3x'
              />
            </div>
            <div className='text-container'>
              <h5 className='font-weight-bold beneficio-titulo'>ENVÍOS</h5>
              <p className='beneficios'>Envíos a todo Chile</p>
            </div>
          </div>
          <div className='col-12 col-md-4 d-flex mb-4'>
            <div className='icon-container me-3'>
              <FontAwesomeIcon
                className='iconos-beneficios'
                icon={faHeadset}
                size='3x'
              />
            </div>
            <div className='text-container'>
              <h5 className='font-weight-bold beneficio-titulo'>CONTACTO</h5>
              <p className='beneficios'>
                Si necesitas contactarnos con nosotros, escribenos
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
