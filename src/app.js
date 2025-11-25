import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Rutas importadas
import servidoresRoutes from './routes/servidores.routes.js';
import accesosRoutes from './routes/accesos.routes.js';
import authRoutes from './routes/auth.routes.js';
import chatbotRoutes from'./routes/chatbot.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import conocimientoRoutes from './routes/conocimiento.routes.js';
const app = express();

// Cargar variables de entorno
dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta directa a login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// iniciar el uso de chatbot
app.use('/api/chatbot', chatbotRoutes);

// Después de montar otras rutas API:
app.use('/api/dashboard', dashboardRoutes);

// Montar rutas API bajo /api/
app.use('/api/servidores', servidoresRoutes);
app.use('/api/accesos', accesosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/conocimientos', conocimientoRoutes);

export default app;
