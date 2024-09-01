import { Container, Row, Col } from 'react-bootstrap'
import instagramLogo from '../assets/imgs/instagram.png'
import tiktokLogo from '../assets/imgs/tiktok.png'
import footerLogo from '../assets/imgs/logo.png'
import redcompraLogo from '../assets/imgs/redcompra.png'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col xs={12} md={4} className='text-center text-md-start'>
            <h5>Contáctanos</h5>
            <p>+569 4512 6062</p>
            <a href='mailto:elamannav@gmail.com' className='text-white'>
              elamannav@gmail.com
            </a>
            <div className='mt-2'>
              <a
                href='https://www.instagram.com/nube.kids.and.ladies/'
                target='_blank'
                rel='noopener noreferrer'
                className='me-3 text-white'
              >
                <img
                  className='rrss'
                  src={instagramLogo}
                  alt='Logo_Instagram'
                />
              </a>
              <a
                href='https://www.tiktok.com/@nubekl'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white'
              >
                <img className='rrss' src={tiktokLogo} alt='Logo_TikTok' />
              </a>
            </div>
          </Col>
          <Col xs={12} md={4} className='text-center my-3 my-md-5'>
            <img
              className='logo-footer'
              src={footerLogo}
              alt='Logo Nube Kids and Ladies'
            />
          </Col>
          <Col xs={12} md={4} className='text-center text-md-end my-3'>
            <img
              className='metodo-pago-footer'
              src={redcompraLogo}
              alt='Métodos de Pago'
            />
            <p className='mt-5 rigths-reserve'>
              © 2024 Nube Kids & Ladies. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
