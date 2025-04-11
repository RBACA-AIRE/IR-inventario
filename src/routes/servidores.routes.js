import { Router } from 'express';
import {
  createServidor,
  deleteServidor,
  getServidor,
  getServidores,
  updateServidor
} from '../controllers/servidores.controllers.js';

const router = Router();

router.get('/servidores', getServidores);

router.get('/servidores/:id', getServidor);

router.post('/servidores', createServidor);

router.put('/servidores/:id', updateServidor);

router.delete('/servidores/:id', deleteServidor); // <- corregido aquí

export default router;
