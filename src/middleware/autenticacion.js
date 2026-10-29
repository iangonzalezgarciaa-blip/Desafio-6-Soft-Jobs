import jwt from 'jsonwebtoken';
import { extraerToken } from '../utils/validaciones.js';
export function exigirCredenciales(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Debo proporcionar email y contraseña' });
  }
  next();
}
export function verificarToken(req, res, next) {
  const token = extraerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ error: 'Debo enviar un token en Authorization' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!payload || typeof payload.email !== 'string') return res.status(401).json({ error: 'Token inválido' });
    req.usuario = { email: payload.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
export function registrarConsultas(req, res, next) {
  const inicio = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - inicio} ms)`);
  });
  next();
}