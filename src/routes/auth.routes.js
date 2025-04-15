import { Router } from "express";

import {
    loginUsuario,
    registerUsuario,
    obtenerRoles,
    obtenerListadoUsuarios,
    obtenerListadoAreas,
    obtenerListadoCargos,
  } from "../controllers/auth.controller.js"; 

  const router = Router();
  router.post("/login", loginUsuario); // Aquí se hace el login
  
  // Ruta para obtener los roles
  router.get("/roles", obtenerRoles); //obtener roles
  router.get("/areas", obtenerListadoAreas); //obtener areas
  router.get("/cargos", obtenerListadoCargos); // obtener cargos
  router.get("/usuario", obtenerListadoUsuarios); // Listar usuarios
  router.post("/usuario", registerUsuario); // <- Nueva ruta de registro

  export default router;