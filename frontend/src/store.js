import { create } from 'zustand';




const useStore = create((set) => ({
  // Estado inicial
  token: null,
  files: [],
  questions: [],
  isLoading: false,
  evaluationQuestions: [],
  pastAssessments: [],

  // Acciones para modificar el estado
  setToken: (token) => set({ token: token }),
  setFiles: (files) => set({ files: files }),
  logout: () => set({ token: null, files: [], questions: [], evaluationQuestions: [], pastAssessments: [] }),
  setQuestions: (questions) => set({ questions: questions }),
  setLoading: (loading) => set({ isLoading: loading }),
  addQuestionToEvaluation: (question) => set((state) => ({ evaluationQuestions: [...state.evaluationQuestions, question] })),
  setEvaluationQuestions: (questions) => set({ evaluationQuestions: questions }),
  setPastAssessments: (assessments) => set({ pastAssessments: assessments }),
}));

export default useStore;
