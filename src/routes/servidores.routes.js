import { Router } from 'express';

// Asegúrate de que las rutas sean correctas
import {
  createServidor,
  deleteServidor,
  getServidor,
  getServidores,
  updateServidor
} from '../controllers/servidores.controllers.js';

import { loginUsuario } from '../controllers/auth.controller.js';  // Asegúrate de que este archivo existe

const router = Router();

// Ruta para login
// Asegúrate de que la ruta esté definida correctamente y que `loginUsuario` exista en el archivo `auth.controller.js`
router.post('/login', loginUsuario); // Aquí se hace el login

// Rutas para la gestión de servidores
router.get('/servidores', getServidores);          // Obtener todos los servidores
router.get('/servidores/:id', getServidor);       // Obtener un servidor por su ID
router.post('/servidores', createServidor);       // Crear un servidor
router.put('/servidores/:id', updateServidor);   // Actualizar un servidor
router.delete('/servidores/:id', deleteServidor); // Eliminar un servidor

export default router;

