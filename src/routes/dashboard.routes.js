import express from 'express';
import { getConnection } from '../database/connectionSQLServer.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();

    // Ejecutamos el procedimiento almacenado
    const result = await pool.request()
      .execute('sp_EstadisticasDashboard');

    // El resultado viene en result.recordset[0]
    const stats = result.recordset[0];

    res.json({
      totalUsuarios: stats.totalUsuarios,
      totalAccesos: stats.totalAccesos,
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;

