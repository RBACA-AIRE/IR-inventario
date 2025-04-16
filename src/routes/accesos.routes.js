import { Router } from "express";
import {
  getAccesos,
  getAcceso,
  createAcceso,
  updateAcceso,
  deleteAcceso,
  cargarSistemas,
  cargarAmbientes,
  cargarUnidadNegocio,
  cargarTipoConexion
} from "../controllers/accesos.controller.js";

const router = Router();

// Rutas para la gestión de accesos remotos
router.get("/accesos", getAccesos);             // Obtener todos los accesos remotos
router.get("/accesos/:id", getAcceso);           // Obtener un acceso remoto por ID
router.post("/accesos", createAcceso);           // Crear un nuevo acceso remoto
router.put("/accesos/:id", updateAcceso);        // Actualizar un acceso remoto
router.delete("/accesos/:id", deleteAcceso);     // Eliminar un acceso remoto

router.get("/sistemas", cargarSistemas); //obtener sistemas
router.get("/ambientes", cargarAmbientes); //obtener ambientes
router.get("/tipoconexion", cargarTipoConexion); // obtener tipo de acceso
router.get("/unidadnegocio", cargarUnidadNegocio); //obtener unidad de negocio
export default router;

