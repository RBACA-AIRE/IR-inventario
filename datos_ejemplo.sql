
-- ===========================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- ===========================================

-- Roles
INSERT INTO Rol (nombre) VALUES ('Administrador'), ('Técnico'), ('Invitado');

-- Permisos
INSERT INTO Permiso (nombre, descripcion) VALUES 
('Acceso Completo', 'Permite acceso completo al sistema'),
('Gestión de Servidores', 'Permite crear, editar y eliminar servidores'),
('Visualización', 'Permite solo lectura');

-- Relación Rol-Permiso
INSERT INTO RolPermiso (id_rol, id_permiso) VALUES 
(1, 1), (1, 2), (1, 3), 
(2, 2), (2, 3),
(3, 3);

-- Usuarios
INSERT INTO Usuario (username, correo, contrasena_encriptada, id_rol) VALUES 
('admin', 'admin@example.com', 'encrypted_password1', 1),
('tecnico01', 'tecnico01@example.com', 'encrypted_password2', 2),
('invitado', 'invitado@example.com', 'encrypted_password3', 3);

-- Servidores
INSERT INTO Servidor (nombre, direccion_ip, sistema_operativo, ambiente, descripcion) VALUES 
('Srv-DB01', '192.168.1.10', 'Windows Server', 'Producción', 'Servidor de base de datos principal'),
('Srv-LNX01', '192.168.1.20', 'Linux', 'Desarrollo', 'Servidor de pruebas de desarrollo');

-- Credenciales de acceso
INSERT INTO CredencialAcceso (usuario_acceso, contrasena_encriptada, tipo_acceso, id_servidor) VALUES 
('dbadmin', 'encrypted_db_pass', 'RDP', 1),
('devuser', 'encrypted_ssh_pass', 'SSH', 2);

-- Proveedores
INSERT INTO Proveedor (nombre, contacto) VALUES 
('Proveedor A', 'contacto@proveedora.com'),
('Proveedor B', 'contacto@proveedorb.com');

-- Ubicaciones
INSERT INTO Ubicacion (direccion, nivel, id_proveedor) VALUES 
('Edificio Principal, Piso 1', 'Alto', 1),
('Sede Alterna, Piso 3', 'Medio', 2);

-- Equipos
INSERT INTO Equipo (nombre, tipo, numero_serie, marca, modelo, id_ubicacion) VALUES 
('Servidor Dell', 'Servidor', 'SN12345', 'Dell', 'PowerEdge R730', 1),
('PC Escritorio', 'Computadora', 'SN54321', 'HP', 'EliteDesk 800', 2);

-- Características de equipos
INSERT INTO CaracteristicaEquipo (descripcion, id_equipo) VALUES 
('32GB RAM, 1TB SSD', 1),
('16GB RAM, 512GB SSD', 2);

-- Asignación de equipos
INSERT INTO AsignacionEquipo (id_equipo, id_usuario, fecha_asignacion) VALUES 
(1, 1, '2025-01-15'),
(2, 2, '2025-01-20');

-- Historial de cambios
INSERT INTO HistorialCambiosEquipo (id_equipo, descripcion_cambio, realizado_por) VALUES 
(1, 'Actualización de firmware', 1),
(2, 'Reemplazo de disco duro', 2);

-- Categorías de conocimiento
INSERT INTO CategoriaConocimiento (nombre) VALUES 
('Redes'),
('Sistemas Operativos');

-- Documentos de conocimiento
INSERT INTO DocumentoConocimiento (titulo, contenido, id_autor, id_categoria) VALUES 
('Configuración de Switch Cisco', 'Paso a paso para configuración básica.', 1, 1),
('Instalación de Ubuntu Server', 'Guía para instalar y configurar Ubuntu.', 2, 2);

-- Revisiones de documentos
INSERT INTO RevisionDocumento (id_documento, cambios, revisado_por) VALUES 
(1, 'Se agregó configuración de VLANs', 2),
(2, 'Corrección en pasos de instalación', 1);
