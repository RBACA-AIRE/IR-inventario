import bcrypt from 'bcrypt';
import sql from 'mssql';

export const registerUsuario = async (req, res) => {
  const { nombre, correo, password } = req.body;

  // Validar que no falte nada
  if (!nombre || !correo || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  try {
    // Conectarse a la base de datos
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Verificar si el usuario ya existe
    const existingUser = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT id_usuario FROM Usuario WHERE correo = @correo');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('correo', sql.NVarChar, correo)
      .input('contrasena_encriptada', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO Usuario (nombre, correo, contrasena_encriptada)
        VALUES (@nombre, @correo, @contrasena_encriptada)
      `);

    res.status(201).json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
  }
};
