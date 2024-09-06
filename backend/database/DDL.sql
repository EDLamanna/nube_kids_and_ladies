-- DROP DATABASE nubekl;
-- DROP TABLE nubekl;

-- se crea así para especificar el tipo utf-8
CREATE DATABASE nubekl
WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_CL.UTF-8'
    LC_CTYPE = 'es_CL.UTF-8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

\c nubekl

-- Tabla ROLES
CREATE TABLE roles (
    id SERIAL,
    rol VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabla USUARIOS
CREATE TABLE usuarios (
    id VARCHAR(10),
    nombre VARCHAR(25) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(200) NOT NULL,
    rol_id SMALLINT NOT NULL DEFAULT 2,
    contraseña TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla VIVIENDA
CREATE TABLE vivienda (
    id SERIAL,
    casa_dpto VARCHAR(4) CHECK (casa_dpto IN ('casa', 'dpto')),
    PRIMARY KEY (id)
);

-- Tabla REGIONES
CREATE TABLE regiones (
    id SERIAL,
    region VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabla COMUNAS
CREATE TABLE comunas (
    id SERIAL,
    comuna VARCHAR(100) NOT NULL,
    region_id SMALLINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (region_id) REFERENCES regiones(id)
);

-- Tabla USUARIO_INFO
CREATE TABLE usuario_info (
    id SERIAL,
    Usuario_id VARCHAR(10) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    nro_calle VARCHAR(10) NOT NULL,
    vivienda_id INT NOT NULL,
    nro_departamento VARCHAR(10),
    bloque_departamento VARCHAR(10),
    region_id SMALLINT NOT NULL,
    comuna_id SMALLINT NOT NULL,
    telefono_movil VARCHAR(15) NOT NULL,
    telefono_fijo VARCHAR(15),
    PRIMARY KEY (id),
    FOREIGN KEY (Usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (vivienda_id) REFERENCES vivienda(id),
    FOREIGN KEY (region_id) REFERENCES regiones(id),
    FOREIGN KEY (comuna_id) REFERENCES comunas(id)
);

-- Tabla tipo_de_persona
CREATE TABLE tipo_de_persona (
    id SERIAL,
    PRIMARY KEY (id),
    tipo_de_persona VARCHAR(10) NOT NULL
);

-- Tabla TALLAS
CREATE TABLE tallas (
    id SERIAL,
    talla VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabla PRODUCTOS
CREATE TABLE productos (
    id VARCHAR(10) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    tipo_de_persona_id INT,
    talla_id INT NOT NULL,
    precio_unitario INT NOT NULL,
    producto_general_id SERIAL UNIQUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, talla_id),
    FOREIGN KEY (tipo_de_persona_id) REFERENCES tipo_de_persona (id),
    FOREIGN KEY (talla_id) REFERENCES tallas(id)
);

-- Tabla IMAGENES_PRODUCTOS
CREATE TABLE imagenes_productos (
    id SERIAL,
    producto_general_id INT NOT NULL,
    image_url VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (producto_general_id) REFERENCES productos (producto_general_id)
);

-- Tabla LIKES
CREATE TABLE likes (
    id SERIAL,
    usuario_id VARCHAR(10) NOT NULL,
    producto_general_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_general_id) REFERENCES productos (producto_general_id)
);

-- Tabla VENTAS
CREATE TABLE ventas (
    id SERIAL,
    usuario_id VARCHAR(10) NOT NULL,
    fecha_venta DATE NOT NULL,
    monto_total INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla VENTAS_DETALLES
CREATE TABLE ventas_detalles (
    id SERIAL,
    venta_id INT NOT NULL,
    producto_general_id INT NOT NULL,
    talla_id INT NOT NULL,
    cantidad_vendida INT NOT NULL,
    precio_unitario INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (venta_id) REFERENCES ventas (id),
    FOREIGN KEY (producto_general_id) REFERENCES productos (producto_general_id),
    FOREIGN KEY (talla_id) REFERENCES tallas (id)
);
