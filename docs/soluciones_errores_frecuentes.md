---

# Solución de Error Frecuente: Bloque duplicado y sintaxis en App.js

## Error
```
Syntax error: Unexpected token (línea específica)
```

## Explicación Técnica
Este error ocurre cuando se copia y pega código y quedan bloques duplicados, especialmente cierres de componentes o definiciones repetidas. El parser de JavaScript encuentra un token inesperado (por ejemplo, una llave de cierre o una definición de función duplicada) y detiene la compilación.

## Ejemplo de Error
```js
// Incorrecto
}
      </div>
    </Router>
  );
}
      </div>
    </Router>
  );
}

function AuthPage() { ... }

export default App;
```

## Solución
Elimina cualquier bloque duplicado y asegúrate de que solo haya una definición de cada componente y un cierre correcto de las funciones.

## Elementos a Evitar
- No copies y pegues componentes completos sin revisar los cierres y duplicados.
- Revisa siempre el final de los archivos tras grandes cambios.

## Recomendación
Antes de hacer commit, revisa que no haya bloques duplicados ni definiciones repetidas en tus componentes principales.

---

**Solución aplicada:**
Se eliminó el bloque duplicado y la segunda definición de AuthPage en App.js.
# Solución de Error Frecuente: ReferenceError en Express

## Error
```
ReferenceError: Cannot access 'app' before initialization
```

## Explicación Técnica
Este error ocurre cuando se intenta usar la variable `app` (instancia de Express) antes de haberla inicializado con `const app = express();`. En JavaScript, las variables declaradas con `const` no están disponibles hasta que la declaración se ejecuta. Si se define una ruta o se usa `app` antes de esta línea, el motor de Node.js lanzará un ReferenceError.

## Ejemplo de Error
```js
// Incorrecto
app.get('/', (req, res) => {
  res.send('API funcionando');
});
const app = express();
```

## Solución
Asegúrate de inicializar `app` antes de usarla:
```js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('API funcionando');
});
```

## Elementos a Evitar
- No definas rutas, middlewares o uses `app` antes de inicializarlo.
- Revisa siempre el orden de las declaraciones en tus archivos principales (por ejemplo, `server.js`).
- No copies y pegues fragmentos de código sin verificar la posición de las variables y funciones.

## Recomendación
Antes de agregar nuevas rutas o middlewares, verifica que la instancia de Express (`app`) ya esté inicializada. Mantén una estructura clara y ordenada en tus archivos de servidor.

---

**Solución aplicada:**
Se movió la definición del endpoint raíz `/` debajo de la inicialización de `app` en `server.js`.

---

**Referencia:**
- [Node.js ReferenceError](https://nodejs.org/api/errors.html#referenceerror)
- [Express.js documentación](https://expressjs.com/)
