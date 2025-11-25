import { Router } from "express";

import {
    loginUsuario,
    logoutUsuario,
    registerUsuario,
    obtenerRoles,
    obtenerListadoUsuarios,
    obtenerUltimosUsuarios,
    obtenerListadoAreas,
    obtenerListadoCargos,
  } from "../controllers/auth.controller.js"; 

  const router = Router();
  router.post("/login", loginUsuario); // Aquí se hace el login
  router.post("/logout", logoutUsuario); // Aqui se cierra la sesión
  
  // Ruta para obtener los roles
  router.get("/roles", obtenerRoles); //obtener roles
  router.get("/areas", obtenerListadoAreas); //obtener areas
  router.get("/cargos", obtenerListadoCargos); // obtener cargos
  router.get("/usuario", obtenerListadoUsuarios); // Listar usuarios
  router.post("/registerUsuario", registerUsuario); // <- Nueva ruta de registro


  // Ruta para mostrar los 5 ultimos usuarios
  router.get('/ultimos-usuarios', obtenerUltimosUsuarios);

  export default router;