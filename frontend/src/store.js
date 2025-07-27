
import { create } from 'zustand';

// Estado inicial de la aplicación, usado para resetear
const initialState = {
  token: null,
  files: [],
  questions: [],
  evaluationQuestions: [],
  pastAssessments: [],
  isLoading: false,
};

const useStore = create((set) => ({
  // ... Spread del estado inicial para definir todas las propiedades
  ...initialState,

  // --- ACCIONES (Mutaciones del estado) ---

  /**
   * Guarda el token de autenticación en el estado.
   * @param {string} token - El token JWT recibido del backend.
   */
  setToken: (token) => set({ token }),

  /**
   * Guarda la lista de archivos del banco de preguntas.
   * @param {Array} files - Arreglo de archivos.
   */
  setFiles: (files) => set({ files }),

  /**
   * Guarda las preguntas cargadas desde un archivo seleccionado.
   * @param {Array} questions - Arreglo de preguntas.
   */
  setQuestions: (questions) => set({ questions }),

  /**
   * Controla el estado de carga para mostrar spinners.
   * @param {boolean} loading - True si está cargando, false si no.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Añade una pregunta a la lista de la evaluación actual.
   * @param {Object} question - La pregunta a añadir.
   */
  addQuestionToEvaluation: (question) =>
    set((state) => ({
      evaluationQuestions: [...state.evaluationQuestions, question],
    })),

  /**
   * Actualiza la lista de preguntas de la evaluación (usado para reordenar).
   * @param {Array} questions - El nuevo arreglo de preguntas.
   */
  setEvaluationQuestions: (questions) => set({ evaluationQuestions: questions }),
  
  /**
   * Guarda el historial de evaluaciones creadas por el usuario.
   * @param {Array} assessments - Arreglo de evaluaciones pasadas.
   */
  setPastAssessments: (assessments) => set({ pastAssessments: assessments }),

  /**
   * Cierra la sesión del usuario y resetea el estado completo de la aplicación
   * a sus valores iniciales para asegurar que no queden datos sensibles.
   */
  logout: () => set(initialState),
}));

export default useStore;
