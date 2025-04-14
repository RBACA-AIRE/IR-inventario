import { Router } from 'express';

// Asegúrate de que las rutas sean correctas
import {
  createServidor,
  deleteServidor,
  getServidor,
  getServidores,
  updateServidor
} from '../controllers/servidores.controllers.js';

import { loginUsuario, registerUsuario, obtenerRoles, obtenerListadoUsuarios, obtenerListadoAreas, obtenerListadoCargos } from '../controllers/auth.controller.js';  // Asegúrate de que este archivo exista

const router = Router();

// Ruta para login
router.post('/login', loginUsuario); // Aquí se hace el login

// Ruta para obtener los roles
router.get('/api/roles', obtenerRoles);
router.get('/api/areas', obtenerListadoAreas);
router.get('/api/cargos', obtenerListadoCargos);  //obtener roles
router.get('/api/usuario', obtenerListadoUsuarios);  // Listar usuarios

router.post('/api/usuario', registerUsuario); // <- Nueva ruta de registro

// Rutas para la gestión de servidores
router.get('/servidores', getServidores);          // Obtener todos los servidores
router.get('/servidores/:id', getServidor);       // Obtener un servidor por su ID
router.post('/servidores', createServidor);       // Crear un servidor
router.put('/servidores/:id', updateServidor);   // Actualizar un servidor
router.delete('/servidores/:id', deleteServidor); // Eliminar un servidor

export default router;


