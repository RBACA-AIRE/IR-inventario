import { Router } from "express";
import {
  getAccesos,
  getAcceso,
  createAcceso,
  updateAcceso,
  deleteAcceso,
  cargarAmbientes,
  cargarSistemas,
  cargarTipoAccesos
} from "../controllers/accesos.controller.js";

const router = Router();

// Rutas para la gestión de accesos remotos
router.get("/accesos", getAccesos);             // Obtener todos los accesos remotos
router.get("/accesos/:id", getAcceso);           // Obtener un acceso remoto por ID
router.post("/accesos", createAcceso);           // Crear un nuevo acceso remoto
router.put("/accesos/:id", updateAcceso);        // Actualizar un acceso remoto
router.delete("/accesos/:id", deleteAcceso);     // Eliminar un acceso remoto

router.get("/sistemas", cargarSistemas); //obtener roles
router.get("/ambientes", cargarAmbientes); //obtener areas
router.get("/tipoacceso", cargarTipoAccesos); // obtener cargos
export default router;

