# ⚠️ Modo Demo: Acceso sin validación de usuario

Este proyecto puede ejecutarse en modo demo, permitiendo el acceso a la aplicación sin validación de usuario (solo botón “Ingresar”).

**ADVERTENCIA:** Este flujo elimina toda seguridad y solo debe usarse para pruebas, demos o desarrollo. **Nunca usar en producción real.**

## ¿Cómo activar el modo demo?

1. En el frontend, crea o edita el archivo `.env` y agrega:
   
   ```env
   REACT_APP_DEMO_MODE=true
   ```
2. Reinicia el servidor de desarrollo o vuelve a desplegar en Vercel.

## Referencias
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- Documenta siempre los flujos inseguros y nunca los uses en producción.
# Herrmaientas_evaluaci-n
Herramienta para generar evaluación
