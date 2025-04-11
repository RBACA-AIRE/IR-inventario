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
