import jwt from 'jsonwebtoken';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  // Validación de entrada
  if (!correo || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
  }

  try {
    // Conexión a la base de datos
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Consulta parametrizada
    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');

    if (result.recordset.length === 0) {
      console.log('Usuario no encontrado:', correo);
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const usuario = result.recordset[0];
    console.log('Contraseña cifrada en base de datos:', usuario.contrasena_encriptada);

    // Comparar contraseña
    const coincide = await bcrypt.compare(password, usuario.contrasena_encriptada);
    console.log('¿Contraseña coincide?', coincide);

    if (!coincide) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Opciones de cookie
    const cookieOptions = {
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000, // en milisegundos
      httpOnly: true,
      path: "/"
    };

    // Establecer cookie
    res.cookie('token', token, cookieOptions);

    // Responder con éxito
    return res.status(200).json({
      success: true,
      message: 'Usuario logueado correctamente',
      token,
      redirect: '/admin',
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
  }
};

// Endpoint para obtener roles desde la base de datos
export const obtenerRoles = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query('SELECT id_rol, nombre FROM Rol'); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron roles' });
    }

    // Enviar los roles como respuesta
    return res.status(200).json(result.recordset); // Devuelve la lista de roles
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener roles', error: error.message });
  }
};

// Endpoint para obtener roles desde la base de datos
export const obtenerListadoUsuarios = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query('SELECT id_usuario, nombre_completo,username, correo, Rol.nombre FROM Usuario JOIN Rol ON Rol.id_rol = Usuario.id_rol'); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron roles' });
    }

    // Enviar los roles como respuesta
    return res.status(200).json(result.recordset); // Devuelve la lista de roles
  } catch (error) {
    console.error('Error al obtener listado usuarios:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener roles', error: error.message });
  }
};
// Endpoint para obtener áreas desde la base de datos
export const obtenerListadoAreas = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query('SELECT id_area, nombre_area FROM Area'); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron áreas' });
    }

    // Enviar las áreas como respuesta
    return res.status(200).json(result.recordset); // Devuelve la lista de áreas
  } catch (error) {
    console.error('Error al obtener listado de áreas:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener áreas', error: error.message });
  }
};

// Endpoint para obtener cargos desde la base de datos
export const obtenerListadoCargos = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query('SELECT id_cargo, nombre_cargo FROM Cargo'); 

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron cargos' });
    }

    // Enviar los cargos como respuesta
    return res.status(200).json(result.recordset); // Devuelve la lista de cargos
  } catch (error) {
    console.error('Error al obtener listado de cargos:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener cargos', error: error.message });
  }
};



// Función para registrar un usuario
export const registerUsuario = async (req, res) => {
  const { username, correo, password, id_rol } = req.body;

  console.log(req.body);
  

  // Validación de campos obligatorios
  if (!username || !correo || !password || !id_rol) {
    return res.status(400).json({ message: 'Todos los campos (username, correo, password, id_rol) son requeridos' });
  }

  try {
    // Conexión a la base de datos
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Verificar si el correo ya está registrado
    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');

    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.request()
            .input('username', sql.NVarChar, username)
            .input('correo', sql.NVarChar, correo)
            .input('contrasena_encriptada', sql.NVarChar, hashedPassword)
            .input('id_rol', sql.Int, id_rol)
            .input('id_area', sql.Int, id_area)
            .input('id_cargo', sql.Int, id_cargo)
            .query(`
                INSERT INTO Usuario (username, correo, contrasena_encriptada, id_rol, id_area, id_cargo)
                VALUES (@username, @correo, @contrasena_encriptada, @id_rol, @id_area, @id_cargo)
            `);

    // Responder con éxito
    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};
