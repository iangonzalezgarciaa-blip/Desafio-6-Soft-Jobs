export function esEmailValido(email) {
  return typeof email === 'string'
    && email.length <= 50
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validarRegistro(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return 'Debo enviar los datos del usuario en formato JSON';
  }
  const { email, password, rol, lenguage } = datos;
  if (!esEmailValido(email)) return 'Debo ingresar un email válido de hasta 50 caracteres';
  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    return 'La contraseña debe tener entre 6 y 72 caracteres';
  }
  if (rol !== undefined && rol !== null && (typeof rol !== 'string' || rol.length > 25)) {
    return 'El rol debe tener como máximo 25 caracteres';
  }
  if (lenguage !== undefined && lenguage !== null && (typeof lenguage !== 'string' || lenguage.length > 20)) {
    return 'El lenguaje debe tener como máximo 20 caracteres';
  }
  return null;
}
export function extraerToken(authorization) {
  if (typeof authorization !== 'string') return null;
  const bearer = /^Bearer\s+([^\s]+)$/i.exec(authorization.trim());
  return bearer ? bearer[1] : (/^[\w-]+\.[\w-]+\.[\w-]+$/.test(authorization.trim()) ? authorization.trim() : null);
}