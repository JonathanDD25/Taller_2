CREATE DATABASE IF NOT EXISTS register_store;
USE register_store;

-- TABLA PERSONAS
CREATE TABLE personas (
    id_persona INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único autoincremental
    nombre VARCHAR(100), -- Nombre de la persona
    apellido VARCHAR(100), -- Apellido de la persona
    tipo_identificacion VARCHAR(50), -- Tipo de documento (CC, TI, CE, etc.)
    nuip INT,    -- Número único de identificación
    email VARCHAR(100),  -- Correo electrónico
    clave VARCHAR(500),  -- Contraseña (encriptada)
    salario DECIMAL(10,2), -- Salario (números decimales)
    activo BOOLEAN DEFAULT TRUE, -- Estado: 1 (activo), 0 (inactivo)
    fecha_registro DATE DEFAULT (CURRENT_DATE), -- Fecha de registro automática
    imagen LONGBLOB -- Imagen en binario
);

-- Ver registros de personas
SELECT * FROM personas;

-- TABLA USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,  -- Email único
    clave VARCHAR(500),   -- Contraseña encriptada
    rol ENUM('cliente', 'admin', 'super_usuario') 
        DEFAULT 'cliente', -- Rol por defecto cliente
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha/hora de registro
);

-- Ver registros de usuarios
SELECT * FROM usuarios;

-- TABLA PRODUCTOS
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único
    nombre VARCHAR(100) NOT NULL, -- Nombre obligatorio
    descripcion TEXT, -- Descripción
    categoria VARCHAR(100), -- Categoría del producto
    entradas INT DEFAULT 0, -- Entradas de stock
    salidas INT DEFAULT 0, -- Salidas de stock
    stock INT AS (entradas - salidas) VIRTUAL, -- Stock calculado automáticamente
    precio DECIMAL(10,2) NOT NULL, -- Precio con dos decimales
    imagen LONGBLOB, -- Imagen en binario
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de creación
);

-- Ver registros de productos
SELECT * FROM productos;