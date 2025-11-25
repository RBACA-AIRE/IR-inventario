import { Router } from "express";
import {
  obtenerModulosConSubmodulos,
  crearModulo,
  crearSubmodulo,
  obtenerConocimientos
} from "../controllers/conocimiento.controller.js";

const router = Router();

router.get("/", obtenerConocimientos);
router.get("/modulos", obtenerModulosConSubmodulos);
router.post("/modulos", crearModulo);
router.post("/submodulos", crearSubmodulo);

export default router;