import test from 'node:test';
import assert from 'node:assert/strict';
import { esEmailValido, extraerToken, validarRegistro } from '../src/utils/validaciones.js';
test('acepta correos bien formados', () => assert.equal(esEmailValido('desarrollador@softjobs.cl'), true));
test('rechaza correos inválidos', () => assert.equal(esEmailValido('sin-arroba'), false));
test('valida los datos necesarios del registro', () => assert.equal(validarRegistro({ email: 'usuario@correo.cl', password: 'abc123', rol: 'Full Stack', lenguage: 'JavaScript' }), null));
test('rechaza contraseñas demasiado cortas', () => assert.match(validarRegistro({ email: 'usuario@correo.cl', password: '123' }), /contraseña/));
test('extrae token Bearer desde Authorization', () => assert.equal(extraerToken('Bearer uno.dos.tres'), 'uno.dos.tres'));
test('rechaza cabeceras de autenticación inválidas', () => assert.equal(extraerToken('Basic credenciales'), null));