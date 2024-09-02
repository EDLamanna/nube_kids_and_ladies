import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='notfound-container'>
      <h1 className='notfound-title'>404 - Página no encontrada</h1>
      <p className='notfound-message'>Lo sentimos, la página que buscas no existe.</p>
      <Link to='/' className='notfound-link'>Volver a la página principal</Link>
    </div>
  )
}

export default NotFound
