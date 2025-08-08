const { GoogleGenerativeAI } = require("@google/generative-ai");
// This is a test comment to force a new deployment on Render.

// Se espera que la API Key esté configurada en las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Genera una pregunta de evaluación utilizando la API de Gemini.
 */
exports.generateQuestion = async (req, res) => {
  const { objetivoAprendizaje, dificultad, contexto, tipoPregunta = 'Opción Múltiple' } = req.body;

  if (!objetivoAprendizaje || !dificultad || !contexto) {
    return res.status(400).json({ msg: 'Se requiere objetivo de aprendizaje, dificultad y contexto.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `
      Rol: Eres un experto pedagógico y un asistente para la creación de evaluaciones escolares en Chile.
      Tarea: Genera una pregunta de evaluación de tipo "${tipoPregunta}" para estudiantes de educación básica/media.

      Instrucciones Clave:
      1.  **Objetivo de Aprendizaje (OA):** La pregunta debe medir directamente el siguiente OA: "${objetivoAprendizaje}".
      2.  **Dificultad:** El nivel de dificultad debe ser "${dificultad}" (Fácil, Media, Difícil).
      3.  **Contexto:** La pregunta debe estar ambientada en el siguiente contexto: "${contexto}".
      4.  **Formato de Respuesta:** La respuesta DEBE ser un objeto JSON válido, sin ningún texto o formato adicional. La estructura del JSON debe ser la siguiente:
          {
            "pregunta": "El texto completo de la pregunta...",
            "opcionA": "Texto de la alternativa A (potencialmente la correcta)",
            "opcionB": "Texto de la alternativa B (distractor)",
            "opcionC": "Texto de la alternativa C (distractor)",
            "opcionD": "Texto de la alternativa D (distractor)",
            "respuestaCorrecta": "A" // O "B", "C", "D"
          }
      5.  **Calidad Pedagógica:**
          - La pregunta debe ser clara, concisa y bien redactada.
          - La respuesta correcta debe ser inequívocamente la mejor opción.
          - Los distractores (opciones incorrectas) deben ser plausibles y basarse en errores conceptuales comunes de los estudiantes.

      Ejemplo de Contexto: "Problemas matemáticos relacionados con compras en el supermercado".
      Ejemplo de OA: "Resolver problemas que involucran adiciones y sustracciones".

      Genera la pregunta ahora.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpiar y parsear la respuesta JSON
    const jsonResponse = JSON.parse(text.replace(/```json|```/g, '').trim());

    res.status(200).json(jsonResponse);

  } catch (error) {
    console.error('Error al generar pregunta con Gemini:', error);
    res.status(500).send('Error del servidor al interactuar con la API de Gemini.');
  }
};

/**
 * Analiza una pregunta de evaluación existente utilizando la API de Gemini.
 */
exports.analyzeQuestion = async (req, res) => {
  // ... (código existente de analyzeQuestion sin cambios)
};

/**
 * Genera una rúbrica de evaluación utilizando la API de Gemini.
 */
exports.generateRubric = async (req, res) => {
  // ... (código existente sin cambios)
};

/**
 * Adapta una pregunta para estudiantes con Necesidades Educativas Especiales (NEE).
 */
exports.adaptQuestionForNEE = async (req, res) => {
  const { question, adaptationType } = req.body;

  if (!question || !adaptationType) {
    return res.status(400).json({ msg: 'Se requiere la pregunta y el tipo de adaptación.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Rol: Eres un experto en educación diferencial y diseño universal de aprendizaje (DUA).
      Tarea: Adapta la siguiente pregunta de evaluación para que sea más accesible para un estudiante con una necesidad específica.

      Pregunta Original:
      - **Texto:** "${question.pregunta}"
      - **Opciones:** 
        A) ${question.opcionA}
        B) ${question.opcionB}
        C) ${question.opcionC}
        D) ${question.opcionD}

      Necesidad Específica del Estudiante:
      - **Adaptación Requerida:** "${adaptationType}"

      Instrucciones de Adaptación:
      1.  **Reescribir la Pregunta:** Modifica el enunciado y/o las alternativas para cumplir con la adaptación solicitada.
      2.  **Mantener el Objetivo:** La pregunta adaptada debe seguir evaluando el mismo objetivo de aprendizaje que la original.
      3.  **Justificación:** Explica brevemente por qué los cambios realizados ayudan al estudiante con la necesidad descrita.

      Ejemplos de Adaptación:
      - Para DEA (Dificultades Específicas del Aprendizaje): "Simplifica el lenguaje, usa frases más cortas y destaca las palabras clave."
      - Para TDAH (Trastorno por Déficit de Atención e Hiperactividad): "Divide el problema en pasos más pequeños y numerados."
      - Para Espectro Autista: "Usa lenguaje literal, evita dobles sentidos y proporciona un contexto social explícito si es necesario."

      Formato de Respuesta: Devuelve un objeto JSON válido con la siguiente estructura, sin texto adicional:
      {
        "adaptedQuestion": {
          "pregunta": "El nuevo texto de la pregunta adaptada...",
          "opcionA": "Texto de la alternativa A adaptada",
          "opcionB": "Texto de la alternativa B adaptada",
          "opcionC": "Texto de la alternativa C adaptada",
          "opcionD": "Texto de la alternativa D adaptada"
        },
        "justification": "La breve explicación de los cambios realizados..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonResponse = JSON.parse(text.replace(/```json|```/g, '').trim());

    res.status(200).json(jsonResponse);

  } catch (error) {
    console.error('Error al adaptar la pregunta con Gemini:', error);
    res.status(500).send('Error del servidor al interactuar con la API de Gemini.');
  }
};
  const { description, criteria, levels } = req.body;

  if (!description || !criteria || !levels) {
    return res.status(400).json({ msg: 'Se requiere descripción, criterios y niveles de logro.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Rol: Eres un experto en evaluación pedagógica.
      Tarea: Crea una rúbrica de evaluación detallada para una tarea o pregunta de desarrollo.

      Información Proporcionada por el Docente:
      - **Descripción de la Tarea a Evaluar:** "${description}"
      - **Criterios de Evaluación (separados por comas):** "${criteria}"
      - **Niveles de Logro (separados por comas):** "${levels}" (Ej: Logrado, En Desarrollo, Por Lograr)

      Instrucciones para la Rúbrica:
      1.  **Estructura:** La rúbrica debe ser una tabla o una lista bien estructurada.
      2.  **Contenido:** Para cada criterio de evaluación, describe en detalle qué se espera del estudiante para cada uno de los niveles de logro definidos.
      3.  **Lenguaje:** Utiliza un lenguaje claro, preciso y orientado a la acción, de modo que tanto el docente como el estudiante puedan entender fácilmente las expectativas.

      Formato de Respuesta: Proporciona la respuesta como un texto plano utilizando formato Markdown para crear una tabla o una lista clara y legible. Asegúrate de que la estructura sea coherente y fácil de interpretar.

      Genera la rúbrica ahora.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ rubric: text });

  } catch (error) {
    console.error('Error al generar la rúbrica con Gemini:', error);
    res.status(500).send('Error del servidor al interactuar con la API de Gemini.');
  }
};
  const { pregunta, opcionA, opcionB, opcionC, opcionD, oa } = req.body;

  if (!pregunta || !opcionA || !opcionB || !opcionC || !opcionD) {
    return res.status(400).json({ msg: 'Se requiere el texto de la pregunta y todas las alternativas.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Rol: Eres un experto en psicometría y pedagogía, especializado en la evaluación de ítems educativos.
      Tarea: Analiza la siguiente pregunta de opción múltiple y proporciona retroalimentación constructiva.

      Pregunta a Analizar:
      - **Texto de la Pregunta:** "${pregunta}"
      - **Alternativa A:** "${opcionA}"
      - **Alternativa B:** "${opcionB}"
      - **Alternativa C:** "${opcionC}"
      - **Alternativa D:** "${opcionD}"
      - **Objetivo de Aprendizaje (si se proporciona):** "${oa || 'No especificado'}"

      Instrucciones de Análisis:
      1.  **Claridad y Redacción:** Evalúa si la pregunta está formulada de manera clara y sin ambigüedades.
      2.  **Calidad de los Distractores:** Analiza si las opciones incorrectas son plausibles y si representan errores comunes. Indica si algún distractor es demasiado obvio o confuso.
      3.  **Alineación con el OA:** Si se proporcionó un OA, evalúa qué tan bien la pregunta mide ese objetivo específico.
      4.  **Sugerencia de Mejora:** Ofrece una sugerencia concreta para mejorar la pregunta, si es posible. Puede ser una reformulación del enunciado o un ajuste en las alternativas.
      5.  **Clasificación (Taxonomía de Bloom):** Clasifica la pregunta en uno de los niveles de la Taxonomía de Bloom (Recordar, Comprender, Aplicar, Analizar, Evaluar, Crear) y justifica brevemente tu clasificación.

      Formato de Respuesta: Proporciona la respuesta como un texto plano, bien estructurado con títulos para cada sección del análisis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ analysis: text });

  } catch (error) {
    console.error('Error al analizar la pregunta con Gemini:', error);
    res.status(500).send('Error del servidor al interactuar con la API de Gemini.');
  }
};
