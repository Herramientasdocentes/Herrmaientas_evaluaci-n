# Documentación de la API - Autenticación

## POST /api/auth/register
Registra un nuevo usuario en la plataforma.

### Parámetros (JSON en body):
- `nombre` (string, requerido): Nombre completo del usuario.
- `email` (string, requerido): Correo electrónico único.
- `password` (string, requerido): Contraseña (mínimo 6 caracteres).

### Respuestas:
- **201 Created**: Usuario registrado correctamente.
  - `{ msg: 'Usuario registrado correctamente.' }`
- **400 Bad Request**: Datos inválidos o email repetido.
  - `{ errores: { campo: 'mensaje' } }` o `{ msg: 'El usuario ya existe.' }`
- **500 Internal Server Error**: Error inesperado.
  - `{ msg: 'Error en el registro.' }`

---

## POST /api/auth/login
Inicia sesión y retorna un token JWT.

### Parámetros (JSON en body):
- `email` (string, requerido): Correo electrónico.
- `password` (string, requerido): Contraseña.

### Respuestas:
- **200 OK**: Login exitoso.
  - `{ token: 'JWT_TOKEN' }`
- **400 Bad Request**: Credenciales faltantes o incorrectas.
  - `{ msg: 'Todos los campos son obligatorios.' }` o `{ msg: 'Credenciales inválidas.' }`
- **500 Internal Server Error**: Error inesperado.
  - `{ msg: 'Error en el login.' }`

---

> Actualiza este archivo cada vez que se agregue o modifique un endpoint.
