
-- ===========================================
-- SCRIPT DE BASE DE DATOS: SISTEMA DE INVENTARIO DE EQUIPOS
-- MÓDULOS: Gestión de Usuarios, Accesos Remotos, Inventario General, Base del Conocimiento
-- ===========================================

-- ===========================================
-- MÓDULO: GESTIÓN DE USUARIOS
-- ===========================================
CREATE TABLE Rol (
    id_rol INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    contrasena_encriptada VARCHAR(255),
    id_rol INT,
    creado_en DATETIME DEFAULT GETDATE(),
    actualizado_en DATETIME,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

CREATE TABLE Permiso (
    id_permiso INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE RolPermiso (
    id_rol INT,
    id_permiso INT,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);

-- ===========================================
-- MÓDULO: ACCESOS REMOTOS
-- ===========================================
CREATE TABLE Servidor (
    id_servidor INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion_ip VARCHAR(50),
    sistema_operativo VARCHAR(50),
    ambiente VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE CredencialAcceso (
    id_credencial INT PRIMARY KEY,
    usuario_acceso VARCHAR(100),
    contrasena_encriptada VARCHAR(255),
    tipo_acceso VARCHAR(50),
    id_servidor INT,
    FOREIGN KEY (id_servidor) REFERENCES Servidor(id_servidor)
);

CREATE TABLE RegistroAcceso (
    id_registro INT PRIMARY KEY,
    id_usuario INT,
    id_servidor INT,
    fecha_acceso DATETIME DEFAULT GETDATE(),
    observaciones TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_servidor) REFERENCES Servidor(id_servidor)
);

-- ===========================================
-- MÓDULO: INVENTARIO GENERAL
-- ===========================================
CREATE TABLE Proveedor (
    id_proveedor INT PRIMARY KEY,
    nombre VARCHAR(100),
    contacto VARCHAR(100)
);

CREATE TABLE Ubicacion (
    id_ubicacion INT PRIMARY KEY,
    direccion VARCHAR(200),
    nivel VARCHAR(50),
    id_proveedor INT,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
);

CREATE TABLE Equipo (
    id_equipo INT PRIMARY KEY,
    nombre VARCHAR(100),
    tipo VARCHAR(50),
    numero_serie VARCHAR(100),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    id_ubicacion INT,
    FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion(id_ubicacion)
);

CREATE TABLE CaracteristicaEquipo (
    id_caracteristica INT PRIMARY KEY,
    descripcion VARCHAR(255),
    id_equipo INT,
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
);

CREATE TABLE AsignacionEquipo (
    id_asignacion INT PRIMARY KEY,
    id_equipo INT,
    id_usuario INT,
    fecha_asignacion DATE,
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE HistorialCambiosEquipo (
    id_historial INT PRIMARY KEY,
    id_equipo INT,
    fecha_cambio DATETIME DEFAULT GETDATE(),
    descripcion_cambio TEXT,
    realizado_por INT,
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (realizado_por) REFERENCES Usuario(id_usuario)
);

-- ===========================================
-- MÓDULO: BASE DEL CONOCIMIENTO
-- ===========================================
CREATE TABLE CategoriaConocimiento (
    id_categoria INT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE DocumentoConocimiento (
    id_documento INT PRIMARY KEY,
    titulo VARCHAR(255),
    contenido TEXT,
    autor_id INT,
    fecha_publicacion DATETIME DEFAULT GETDATE(),
    id_categoria INT,
    FOREIGN KEY (autor_id) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES CategoriaConocimiento(id_categoria)
);

CREATE TABLE RevisionDocumento (
    id_revision INT PRIMARY KEY,
    id_documento INT,
    fecha_revision DATETIME DEFAULT GETDATE(),
    cambios TEXT,
    revisado_por INT,
    FOREIGN KEY (id_documento) REFERENCES DocumentoConocimiento(id_documento),
    FOREIGN KEY (revisado_por) REFERENCES Usuario(id_usuario)
);

-- ===========================================
-- VISTA ADMINISTRATIVA
-- ===========================================
CREATE VIEW Vista_Resumen_Admin AS
SELECT 
    u.username AS Usuario,
    r.nombre AS Rol,
    s.nombre AS Servidor,
    ra.fecha_acceso,
    e.nombre AS Equipo,
    eq.tipo,
    ub.direccion AS Ubicacion
FROM Usuario u
LEFT JOIN Rol r ON u.id_rol = r.id_rol
LEFT JOIN RegistroAcceso ra ON u.id_usuario = ra.id_usuario
LEFT JOIN Servidor s ON ra.id_servidor = s.id_servidor
LEFT JOIN AsignacionEquipo ae ON u.id_usuario = ae.id_usuario
LEFT JOIN Equipo e ON ae.id_equipo = e.id_equipo
LEFT JOIN Ubicacion ub ON e.id_ubicacion = ub.id_ubicacion;
