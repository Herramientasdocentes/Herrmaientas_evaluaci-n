
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import useStore from '../store';
import QuestionPanel from './QuestionPanel';
import PastAssessments from './PastAssessments';
import EvaluationCanvas from './EvaluationCanvas';

function Dashboard() {
  const { token, files, setFiles, logout, setQuestions, setLoading } = useStore();
  // Define la URL base de la API
  const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

  // Función para cargar las preguntas de un OA específico
  const loadQuestionsByOA = async (oa) => {
    setLoading(true);
    setQuestions([]); // Limpiamos las preguntas anteriores
    try {
      const config = { headers: { 'x-auth-token': token } };
      // Llamamos a la ruta de questions, filtrando por oa
      const response = await axios.get(`${API_URL}/api/questions?oa=${oa}`, config);
      setQuestions(response.data.questions); // La API devuelve un objeto con una propiedad 'questions'
    } catch (error) {
      console.error('Error al cargar las preguntas:', error);
      toast.error('No se pudieron cargar las preguntas.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los OAs (bancos) al iniciar
  useEffect(() => {
    const fetchOAs = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get(`${API_URL}/api/banco`, config);
        setFiles(response.data); // El backend ahora devuelve el formato correcto
      } catch (error) {
        console.error('Error al obtener los bancos de preguntas:', error);
        toast.error('Tu sesión puede haber expirado. Por favor, inicia sesión de nuevo.');
        logout();
      }
    };
    if (token) {
      fetchOAs();
    }
  }, [token, setFiles, logout]);

  return (
    <div>
      <h2>Panel del Docente</h2>
      <button onClick={logout}>Cerrar Sesión</button>
      <h3>Bancos de Preguntas por OA:</h3>
      <ul>
        {files.length > 0 ? (
          files.map((banco) => (
            <li key={banco.id} onClick={() => loadQuestionsByOA(banco.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {banco.name}
            </li>
          ))
        ) : (
          <p>No se encontraron bancos de preguntas. Agregue preguntas para verlos aquí.</p>
        )}
      </ul>
      {/* Paneles lado a lado */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <QuestionPanel />
        <PastAssessments />
        <EvaluationCanvas />
      </div>
    </div>
  );
}

export default Dashboard;
