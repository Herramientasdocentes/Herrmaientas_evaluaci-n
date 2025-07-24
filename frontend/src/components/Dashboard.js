import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import useStore from '../store';
import QuestionPanel from './QuestionPanel';

function Dashboard() {
  import PastAssessments from './PastAssessments';
  const { token, files, setFiles, logout, setQuestions, setLoading } = useStore();

  // Función para cargar las preguntas de un archivo específico
  const loadQuestions = async (fileId) => {
    setLoading(true);
    setQuestions([]); // Limpiamos las preguntas anteriores
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`http://localhost:5000/api/banco/preguntas/${fileId}`, config);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error al cargar las preguntas:', error);
      toast.error('No se pudieron cargar las preguntas.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los archivos al iniciar
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get('http://localhost:5000/api/banco', config);
        setFiles(response.data);
      } catch (error) {
        console.error('Error al obtener los archivos:', error);
        toast.error('Tu sesión puede haber expirado. Por favor, inicia sesión de nuevo.');
        logout();
      }
    };
    if (token) {
      fetchFiles();
    }
  }, [token, setFiles, logout]);

  return (
    <div>
      <h2>Panel del Docente</h2>
      <button onClick={logout}>Cerrar Sesión</button>
      <h3>Bancos de Preguntas Disponibles:</h3>
      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file.id} onClick={() => loadQuestions(file.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {file.name}
            </li>
          ))
        ) : (
          <p>Cargando archivos...</p>
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
