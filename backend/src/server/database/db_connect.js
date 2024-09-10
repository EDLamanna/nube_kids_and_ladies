import pg from 'pg'

const { Pool } = pg

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  allowExitOnIdle: true
}

const pool = new Pool(config)

pool.on('connect', () => {
})

pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err)
})

// Función para ejecutar consultas en la base de datos
const db = async (query, values) => {
  const client = await pool.connect()
  try {
    const result = await client.query(query, values)
    return result
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error)
    throw error
  } finally {
    client.release()
  }
}

export default db
