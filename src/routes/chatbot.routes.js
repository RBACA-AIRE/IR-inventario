import express from 'express';
import { procesarMensaje } from '../controllers/chatbot.controller.js';

const router = express.Router();

// Asegúrate que aquí es POST y que procesarMensaje reciba (req, res)
router.post('/', (req, res) => {
  try {
    procesarMensaje(req, res);
  } catch (error) {
    console.error("Error en chatbot route:", error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;
