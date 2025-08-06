# Guía de Buenas Prácticas y Reglas del Proyecto

## Lenguajes de Programación Utilizados
- JavaScript (Node.js)
- Python
- Otros lenguajes según módulos específicos (ver documentación interna de cada carpeta)

## Reglas Generales
- Mantener el código limpio y comentado.
- Seguir la convención de nombres camelCase para variables y funciones en JavaScript y snake_case en Python.
- Usar control de versiones (Git) para todos los cambios.
- Realizar commits descriptivos y frecuentes.
- No subir archivos sensibles ni credenciales al repositorio (usar `.env` y agregar a `.gitignore`).
- Documentar todas las funciones y módulos.
- Mantener actualizadas las dependencias.

## Buenas Prácticas
- Validar entradas del usuario en backend y frontend.
- Manejar errores con try/catch y logs claros.
- Escribir pruebas unitarias y de integración.
- Revisar y probar el código antes de hacer push.
- Usar linters y formateadores automáticos (por ejemplo, ESLint, Prettier).
- Separar la lógica de negocio de la lógica de presentación.
- Mantener la documentación actualizada en la carpeta `docs/`.

## Errores Comunes Solucionados
- Problemas de rutas relativas/absolutas en imports.
- Manejo incorrecto de variables de entorno.
- Errores de permisos en archivos y carpetas.
- Conflictos de dependencias solucionados con `npm install` o `pip install`.
- Problemas de CORS resueltos en el backend.

## Errores a Evitar
- No validar datos de entrada.
- Hardcodear credenciales o rutas.
- No manejar excepciones.
- No documentar cambios importantes.
- No actualizar dependencias obsoletas.
- No realizar pruebas antes de subir cambios.

## Recomendaciones para 0% de Errores
- Seguir esta guía en cada desarrollo.
- Realizar revisiones de código (code review) entre miembros del equipo.
- Automatizar pruebas y despliegues.
- Mantener comunicación constante en el equipo.
- Consultar la documentación oficial de los frameworks y librerías utilizadas.

## Recursos
- Documentación oficial de Node.js: https://nodejs.org/en/docs/
- Documentación oficial de Python: https://docs.python.org/3/
- Guía de estilo de JavaScript: https://github.com/airbnb/javascript
- Guía de estilo de Python: https://peps.python.org/pep-0008/

---

Actualiza este documento cada vez que se resuelva un nuevo error o se adopte una nueva práctica.
