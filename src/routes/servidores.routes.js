import { Router } from "express";

// Asegúrate de que las rutas sean correctas
import {
  createServidor,
  deleteServidor,
  getServidor,
  getServidores,
  updateServidor,
} from "../controllers/servidores.controllers.js";

const router = Router();  // Crear la instancia de router

// Rutas para la gestión de servidores
router.get("/api/servidores", getServidores); // Obtener todos los servidores
router.get("/api/servidores/:id", getServidor); // Obtener un servidor por su ID
router.post("/api/servidores", createServidor); // Crear un servidor
router.put("/api/servidores/:id", updateServidor); // Actualizar un servidor
router.delete("/api/servidores/:id", deleteServidor); // Eliminar un servidor

export default router;

