import request from 'supertest'
import app from '../src/server/app.js'
import { describe, expect, test, beforeAll } from 'vitest'
import dotenv from 'dotenv'
dotenv.config()

const validCredentials = {
  email: 'edmhlv@gmail.com',
  contraseña: 'faraoned9080'
}

const invalidCredentials = {
  email: 'wronguser@test.com',
  contraseña: 'faraoned9080'
}

const userId = '25257529-4'

let authToken = ''

describe('Operaciones CRUD de nubeKL', () => {
  // Obtener el token antes de ejecutar las pruebas
  beforeAll(async () => {
    const response = await request(app).post('/login').send(validCredentials)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    authToken = response.body.token
  })

  test('POST /login | Al enviar credenciales correctas obtiene un objeto con token', async () => {
    const response = await request(app).post('/login').send(validCredentials)
    expect(response.body).toHaveProperty('token')
    expect(response.statusCode).toBe(200)
  })

  test('POST /login | Al enviar credenciales incorrectas se obtiene un status code 401', async () => {
    const response = await request(app).post('/login').send(invalidCredentials)
    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message', 'Usuario o contraseña incorrecta')
  })

  test('GET /tienda | Se obtiene un status code 200 y un Array de productos', async () => {
    const response = await request(app).get('/tienda').set('Authorization', `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  test('GET /mi_perfil/:id | Obtener perfil del usuario autenticado', async () => {
    const response = await request(app).get(`/mi_perfil/${userId}`).set('Authorization', `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('nombre') // muestra el nombre del usuario, ya que genera un objeto con sus datos de perfil
  })

  test('GET /ventas | Obtener todas las ventas (solo para administradores)', async () => {
    // Solo si hay ventas
    const response = await request(app).get('/ventas').set('Authorization', `Bearer ${authToken}`) // Incluye el token de administrador

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', 'Ventas obtenidas correctamente')
    expect(Array.isArray(response.body.ventas)).toBe(true)

    if (response.body.ventas.length > 0) {
      response.body.ventas.forEach(venta => {
        expect(venta).toHaveProperty('ventaId')
        expect(venta).toHaveProperty('producto')
        expect(venta).toHaveProperty('talla')
        expect(venta).toHaveProperty('cantidadVendida')
        expect(venta).toHaveProperty('precioUnitario')
      })
    }
  })
})
