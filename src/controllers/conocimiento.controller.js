import sql from "mssql";
import { getConnection } from "../database/connectionSQLServer.js";

// Obtener todos los módulos con sus submódulos
export const obtenerModulosConSubmodulos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        m.id AS moduloId,
        m.nombre AS moduloNombre,
        s.id AS submoduloId,
        s.descripcion AS submoduloDescripcion,
        s.url_archivo AS submoduloUrl
      FROM Modulos m
      LEFT JOIN Submodulos s ON m.id = s.id_modulo
      ORDER BY m.nombre, s.descripcion
    `);

    // Agrupar por módulo
    const modulosMap = new Map();

    result.recordset.forEach(row => {
      if (!modulosMap.has(row.moduloId)) {
        modulosMap.set(row.moduloId, {
          id: row.moduloId,
          nombre: row.moduloNombre,
          submodulos: []
        });
      }

      if (row.submoduloId) {
        modulosMap.get(row.moduloId).submodulos.push({
          id: row.submoduloId,
          descripcion: row.submoduloDescripcion,
          url: row.submoduloUrl
        });
      }
    });

    const modulos = Array.from(modulosMap.values());
    res.status(200).json(modulos);
  } catch (error) {
    console.error("Error al obtener módulos y submódulos:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Crear nuevo módulo
export const crearModulo = async (req, res) => {
  const { nombre } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .query("INSERT INTO Modulos (nombre) VALUES (@nombre)");

    res.status(201).json({ mensaje: "Módulo creado correctamente" });
  } catch (error) {
    console.error("Error al crear módulo:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Crear submódulo
export const crearSubmodulo = async (req, res) => {
  const { id_modulo, descripcion, url_archivo } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input("id_modulo", sql.Int, id_modulo)
      .input("descripcion", sql.VarChar, descripcion)
      .input("url_archivo", sql.VarChar, url_archivo)
      .query(`
        INSERT INTO Submodulos (id_modulo, descripcion, url_archivo)
        VALUES (@id_modulo, @descripcion, @url_archivo)
      `);

    res.status(201).json({ mensaje: "Submódulo creado correctamente" });
  } catch (error) {
    console.error("Error al crear submódulo:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Obtener Conocimiento
export const obtenerConocimientos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_ObtenerConocimientos');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error obteniendo conocimientos:', error);
    res.status(500).json({ message: 'Error al obtener conocimientos' });
  }
};