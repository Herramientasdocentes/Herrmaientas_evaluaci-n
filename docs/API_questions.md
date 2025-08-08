# Documentación de la API - Banco de Preguntas

## POST /api/questions
Crea una nueva pregunta en el banco.

### Parámetros (JSON en body):
- `pregunta` (string, requerido): Texto de la pregunta.
- `opcionA` (string, requerido): Opción A.
- `opcionB` (string, requerido): Opción B.
- `opcionC` (string, requerido): Opción C.
- `opcionD` (string, requerido): Opción D.
- `respuestaCorrecta` (string, requerido): Debe ser 'A', 'B', 'C' o 'D'.
- `puntaje` (number, requerido): Puntaje asignado.
- `oa` (string, requerido): Objetivo de Aprendizaje.

### Respuestas:
- **201 Created**: Pregunta creada correctamente.
  - `{ ...pregunta }`
- **400 Bad Request**: Datos inválidos.
  - `{ errors: [ { msg, param } ] }`
- **500 Internal Server Error**: Error inesperado.
  - `{ msg: 'Error del Servidor' }`

---

## PUT /api/questions/:id
Actualiza una pregunta existente.

### Parámetros (JSON en body):
- Igual que POST /api/questions

### Respuestas:
- **200 OK**: Pregunta actualizada correctamente.
  - `{ ...pregunta }`
- **400 Bad Request**: Datos inválidos.
  - `{ errors: [ { msg, param } ] }`
- **404 Not Found**: Pregunta no encontrada.
  - `{ msg: 'Pregunta no encontrada' }`
- **401 Unauthorized**: Usuario no autorizado.
  - `{ msg: 'Usuario no autorizado' }`
- **500 Internal Server Error**: Error inesperado.
  - `{ msg: 'Error del Servidor' }`

---

> Actualiza este archivo cada vez que se agregue o modifique un endpoint.
