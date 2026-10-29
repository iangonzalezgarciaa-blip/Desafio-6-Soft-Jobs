import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { exigirCredenciales, verificarToken } from '../middleware/autenticacion.js';
import { validarRegistro } from '../utils/validaciones.js';
export const router = Router();
router.post('/usuarios', exigirCredenciales, async (req, res, next) => {
  try {
    const errorValidacion = validarRegistro(req.body);
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });
    const { email, password, rol = null, lenguage = null } = req.body;
    const emailNormalizado = email.trim().toLowerCase();
    const passwordCifrada = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING id, email, rol, lenguage',
      [emailNormalizado, passwordCifrada, rol, lenguage]
    );
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(error);
  }
});
router.post('/login', exigirCredenciales, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT id, email, password FROM usuarios WHERE email = $1', [email.trim().toLowerCase()]);
    const usuario = rows[0];
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    return res.json({ token });
  } catch (error) { next(error); }
});
router.get('/usuarios', verificarToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1', [req.usuario.email]);
    if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(rows[0]);
  } catch (error) { next(error); }
});