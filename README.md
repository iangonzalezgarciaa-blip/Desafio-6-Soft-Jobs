# Desafío 6 - Soft Jobs

## Descripción

En este desafío desarrollé una API REST para **Soft Jobs**, una plataforma orientada a desarrolladores junior. Implementé el registro de usuarios, el inicio de sesión mediante JWT y una ruta protegida para consultar los datos del perfil autenticado. Trabajé con Node.js, Express y PostgreSQL.

## Tecnologías utilizadas

- **Node.js y Express:** servidor y rutas.
- **PostgreSQL y pg:** almacenamiento y consultas parametrizadas.
- **bcryptjs:** hash seguro de contraseñas.
- **jsonwebtoken:** firma y validación de tokens JWT.
- **cors y dotenv:** comunicación con el cliente y variables de entorno.

## Instalación y ejecución

1. Instalo las dependencias con `npm install`.
2. Creo la base de datos desde una terminal con PostgreSQL: `psql -U postgres -f sql/softjobs.sql`.
3. Copio `.env.example` a `.env` y configuro mis credenciales de PostgreSQL y un `JWT_SECRET` largo y privado.
4. Inicio la API con `npm start` o `npm run dev`.
5. Compruebo las rutas desde Postman, Thunder Client o el cliente React del material de apoyo.
6. Ejecuto las pruebas unitarias con `npm test`.

Mi servidor se ejecuta por defecto en **http://localhost:3000**. No subo el archivo `.env` porque contiene información privada.

## Rutas implementadas

| Método | Ruta | Qué hace |
| --- | --- | --- |
| POST | `/usuarios` | Registro un usuario y guardo su contraseña como hash bcrypt. |
| POST | `/login` | Compruebo las credenciales y devuelvo un token JWT con el email en el payload. |
| GET | `/usuarios` | Verifico el token de Authorization y devuelvo el perfil sin la contraseña. |

### Ejemplo de registro

```http
POST http://localhost:3000/usuarios
Content-Type: application/json

{
  "email": "usuario@correo.cl",
  "password": "claveSegura123",
  "rol": "Full Stack Developer",
  "lenguage": "JavaScript"
}
```

### Ejemplo de inicio de sesión

```http
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "usuario@correo.cl",
  "password": "claveSegura123"
}
```

Si las credenciales son correctas recibo un objeto JSON con la propiedad `token`.

### Ejemplo de consulta al perfil

```http
GET http://localhost:3000/usuarios
Authorization: Bearer TOKEN_RECIBIDO_EN_LOGIN
```

## Medidas que implementé

- Verifico la presencia de credenciales antes de registrar e iniciar sesión.
- Guardo contraseñas con bcrypt y valido el hash al iniciar sesión.
- Firmo y verifico tokens JWT con una clave secreta configurable, algoritmo HS256 y expiración.
- Extraigo el email desde el payload verificado y consulto el usuario en PostgreSQL.
- Uso consultas SQL parametrizadas para evitar inyección SQL.
- Evito devolver contraseñas o hashes en las respuestas de registro y perfil.
- Registro en la terminal el método, la ruta, el estado HTTP y el tiempo de cada solicitud.
- Capturo los errores y devuelvo respuestas HTTP apropiadas.

## Estructura del proyecto

```text
src/
  app.js
  server.js
  db/pool.js
  middleware/autenticacion.js
  routes/usuarios.js
  utils/validaciones.js
sql/softjobs.sql
tests/validaciones.test.js
.env.example
.gitignore
package.json
README.md
```

**Nota:** El documento del desafío menciona una aplicación React incluida en un *material de apoyo separado*. Ese archivo no forma parte de este repositorio; mi trabajo aquí corresponde al backend solicitado. Conservo el campo `lenguage` con esa ortografía porque así aparece en la estructura SQL del enunciado.

## Pruebas

Mis seis pruebas unitarias verifican formatos de email, validación del registro, rechazo de contraseñas cortas y extracción o rechazo del token de autorización.

Ejecuto las pruebas con:

```bash
npm install
npm test
```

**Resultado de GitHub Actions:** ejecución exitosa. [Ver la ejecución de mis pruebas](https://github.com/iangonzalezgarciaa-blip/Desafio-6-Soft-Jobs/actions/runs/40827491617).

Las pruebas automatizadas no constituyen por sí solas una validación de integración con PostgreSQL o con material de apoyo externo.
