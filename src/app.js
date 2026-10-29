import express from 'express';
import cors from 'cors';
import { router } from './routes/usuarios.js';
import { registrarConsultas } from './middleware/autenticacion.js';
export const app = express();
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3001').split(',').map(o => o.trim());
app.use(cors({ origin: origins }));
app.use(express.json());
app.use(registrarConsultas);
app.use(router);
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'El cuerpo JSON no es válido' });
  }
  console.error('Error en la API:', error);
  return res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});