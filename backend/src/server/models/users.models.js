import db from '../database/db_connect.js'
import { hashPassword, comparePassword } from '../../../utils/encrypt/bcrytp.js'

// consulta para buscar un usuario por su email y obtener también el rol del usuario
export const findUserByEmail = async (email) => {
  try {
    const consulta = `
      SELECT id, email, contraseña, rol_id as role
      FROM usuarios
      WHERE email = $1
    `
    const values = [email]
    const { rows, rowCount } = await db(consulta, values)

    if (rowCount === 0) {
      const newError = { code: 401, message: 'Usuario o contraseña incorrecta' }
      throw newError
    }

    return rows[0]
  } catch (error) {
    const newError = { code: error.code || 500, message: error.message || 'Error al verificar credenciales' }
    throw newError
  }
}

// consulta para obtener el perfil completo de un usuario por su ID
export const getPerfilCompletoById = async (userId) => {
  const query = `
    SELECT
        u.id AS usuario_id,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.fecha_nacimiento,
        u.email,
        ui.direccion,
        ui.nro_calle,
        v.casa_dpto AS vivienda,
        ui.nro_departamento,
        ui.bloque_departamento,
        r.region,
        c.comuna,
        ui.telefono_movil,
        ui.telefono_fijo
    FROM
        usuarios u
    JOIN
        usuario_info ui ON u.id = ui.usuario_id
    JOIN
        vivienda v ON ui.vivienda_id = v.id
    JOIN
        regiones r ON ui.region_id = r.id
    JOIN
        comunas c ON ui.comuna_id = c.id
    WHERE
        u.id = $1
  `

  const values = [userId]
  const { rows } = await db(query, values)
  return rows[0]
}

// consulta para obtener las regiones
export const getRegiones = async () => {
  const query = 'SELECT id, region FROM regiones ORDER BY region ASC'
  const { rows } = await db(query)
  return rows
}

// consulta para obtener las comunas
export const getComunas = async () => {
  const query = `
    SELECT c.id, c.comuna, c.region_id, r.region
    FROM comunas c
    JOIN regiones r ON c.region_id = r.id
    ORDER BY c.comuna ASC
  `
  const { rows } = await db(query)
  return rows
}

// consulta para actualizar un perfil por su Id de usuario
export const actualizarPerfil = async (userId, perfilActualizado) => {
  const {
    direccion,
    nro_calle: nroCalle,
    vivienda_id: viviendaIdTexto,
    nro_departamento: nroDepartamento,
    bloque_departamento: bloqueDepartamento,
    region_id: regionIdTexto,
    comuna_id: comunaIdTexto,
    telefono_movil: telefonoMovil,
    telefono_fijo: telefonoFijo
  } = perfilActualizado

  try {
    // Transacción
    await db('BEGIN')

    // Consulta dinámica para obtener el `vivienda_id`
    const viviendaQuery = 'SELECT id FROM vivienda WHERE casa_dpto = $1'
    const viviendaResult = await db(viviendaQuery, [viviendaIdTexto])
    const viviendaId = viviendaResult.rows[0]?.id

    // Consulta dinámica para obtener el `region_id`
    const regionQuery = 'SELECT id FROM regiones WHERE id = $1'
    const regionResult = await db(regionQuery, [regionIdTexto])
    const regionId = regionResult.rows[0]?.id

    // Consulta dinámica para obtener el `comuna_id`
    const comunaQuery = 'SELECT id FROM comunas WHERE id = $1 AND region_id = $2'
    const comunaResult = await db(comunaQuery, [comunaIdTexto, regionId])
    const comunaId = comunaResult.rows[0]?.id

    // Si cualquiera de los IDs no se encuentra, se debe lanzar un error
    if (!viviendaId || !regionId || !comunaId) {
      console.error('Error al obtener uno de los IDs:', {
        viviendaId,
        regionId,
        comunaId
      })
      throw new Error('Error al obtener los IDs necesarios para la actualización')
    }

    // Consulta de actualización
    const query = `
      UPDATE usuario_info
      SET
        direccion = $1,
        nro_calle = $2,
        vivienda_id = $3,
        nro_departamento = $4,
        bloque_departamento = $5,
        region_id = $6,
        comuna_id = $7,
        telefono_movil = $8,
        telefono_fijo = $9
      WHERE usuario_id = $10
      RETURNING *
    `
    const values = [
      direccion,
      nroCalle,
      viviendaId,
      nroDepartamento,
      bloqueDepartamento,
      regionId,
      comunaId,
      telefonoMovil,
      telefonoFijo,
      userId
    ]

    const result = await db(query, values)
    await db('COMMIT')
    return result
  } catch (error) {
    await db('ROLLBACK')
    console.error('Error al actualizar el perfil:', error)
    throw error
  }
}

// consulta para crear un usuario
export const createUsuario = async (usuarioData) => {
  const {
    rut,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    email,
    contraseña,
    fechaNacimiento,
    direccion = '',
    nroCalle = '',
    viviendaId = 1,
    nroDepartamento = '',
    bloqueDepartamento = '',
    regionId = 1,
    comunaId = 1,
    telefonoMovil = '',
    telefonoFijo = ''
  } = usuarioData

  try {
    // Verifica que el rut no esté vacío o sea nulo
    if (!rut) {
      throw new Error('El RUT no puede estar vacío o indefinido')
    }

    // Hashear la contraseña proporcionada por el usuario
    const passwordEncriptada = await hashPassword(contraseña)

    // Inicia transacción
    await db('BEGIN')

    // Consulta para crear el usuario en la tabla `usuarios`
    const consultaUsuario = `
      INSERT INTO usuarios (id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, rol_id, contraseña)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nombre, email, rol_id
    `
    const valuesUsuario = [rut, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, 2, passwordEncriptada]
    const { rows: usuarioRows, rowCount: usuarioRowCount } = await db(consultaUsuario, valuesUsuario)

    if (usuarioRowCount === 0) {
      throw new Error('No se pudo crear el usuario, por favor intenta más tarde.')
    }

    // Después de crear el usuario, inserta en la tabla usuario_info
    const consultaUsuarioInfo = `
      INSERT INTO usuario_info (
        usuario_id,
        direccion,
        nro_calle,
        vivienda_id,
        nro_departamento,
        bloque_departamento,
        region_id,
        comuna_id,
        telefono_movil,
        telefono_fijo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const valuesUsuarioInfo = [
      rut,
      direccion,
      nroCalle,
      viviendaId,
      nroDepartamento,
      bloqueDepartamento,
      regionId,
      comunaId,
      telefonoMovil,
      telefonoFijo
    ]

    const { rowCount: usuarioInfoRowCount } = await db(consultaUsuarioInfo, valuesUsuarioInfo)

    if (usuarioInfoRowCount === 0) {
      throw new Error('No se pudo poblar la tabla usuario_info, por favor intenta más tarde.')
    }

    // Si todo va bien, finaliza la transacción
    await db('COMMIT')

    return usuarioRows[0]
  } catch (error) {
    // Si ocurre un error, revierte transacción
    await db('ROLLBACK')

    const newError = new Error(error.message)
    newError.code = 500
    throw newError
  }
}

// consulta para verificar las credenciales de un usuario
export const verificarCredenciales = async (email, password) => {
  try {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1'
    const values = [email]
    const { rows, rowCount } = await db(consulta, values)

    if (rowCount === 0) {
      const newError = { code: 401, message: 'Email o contraseña incorrecta' }
      throw newError
    }

    const usuario = rows[0]
    const passwordEncriptada = usuario.contraseña
    const passwordCorrecta = await comparePassword(password, passwordEncriptada)

    if (!passwordCorrecta) {
      const newError = { code: 401, message: 'Email o contraseña incorrecta' }
      throw newError
    }

    return usuario // Retorna el usuario si las credenciales son correctas
  } catch (error) {
    const newError = { code: 500, message: error.message }
    throw newError
  }
}
