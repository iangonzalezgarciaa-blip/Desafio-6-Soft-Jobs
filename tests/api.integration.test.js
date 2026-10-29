import 'dotenv/config';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { app } from '../src/app.js';
import { pool } from '../src/db/pool.js';

const email = 'prueba.softjobs@example.com';
before(async () => {
  await pool.query('CREATE TABLE IF NOT EXISTS usuarios (id SERIAL PRIMARY KEY, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(60) NOT NULL, rol VARCHAR(25), lenguage VARCHAR(20))');
  await pool.query('DELETE FROM usuarios WHERE email = $1',[email]);
});
after(async () => {
  await pool.query('DELETE FROM usuarios WHERE email = $1',[email]);
  await pool.end();
});
test('registro: almaceno contraseña con hash bcrypt sin exponerla',async()=>{
  const res=await request(app).post('/usuarios').send({email,password:'claveSegura123',rol:'Full Stack',lenguage:'JavaScript'});
  assert.equal(res.status,201);
  assert.equal(res.body.usuario.email,email);
  assert.equal(res.body.usuario.password,undefined);
  const {rows}=await pool.query('SELECT password FROM usuarios WHERE email=$1',[email]);
  assert.notEqual(rows[0].password,'claveSegura123');
  assert.equal(await bcrypt.compare('claveSegura123',rows[0].password),true);
});
test('registro duplicado devuelve 409',async()=>{
  const res=await request(app).post('/usuarios').send({email,password:'claveSegura123'});
  assert.equal(res.status,409);
});
test('login: JWT firmado con email y perfil protegido',async()=>{
  const login=await request(app).post('/login').send({email,password:'claveSegura123'});
  assert.equal(login.status,200);
  const payload=jwt.verify(login.body.token,process.env.JWT_SECRET);
  assert.equal(payload.email,email);
  const perfil=await request(app).get('/usuarios').set('Authorization','Bearer '+login.body.token);
  assert.equal(perfil.status,200);
  assert.equal(perfil.body.email,email);
  assert.equal(perfil.body.password,undefined);
});
test('login incorrecto y token inválido',async()=>{
  const login=await request(app).post('/login').send({email,password:'incorrecta'});
  assert.equal(login.status,401);
  const perfil=await request(app).get('/usuarios').set('Authorization','Bearer no.valido.token');
  assert.equal(perfil.status,401);
});
test('perfil sin autorización devuelve 401',async()=>{
  const res=await request(app).get('/usuarios');
  assert.equal(res.status,401);
});
