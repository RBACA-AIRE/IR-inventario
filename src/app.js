import express from 'express'
import servidoresRoutes from './routes/servidores.routes.js'

const app = express();

app.use(express.json());

app.use(servidoresRoutes);

export default app;