import React, { useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';

function PastAssessments() {
  const { token, pastAssessments, setPastAssessments } = useStore();

  useEffect(() => {
    const fetchPastAssessments = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Define la URL base de la API
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/evaluaciones/mis-evaluaciones`, config);
        setPastAssessments(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.warn('No se encontraron evaluaciones pasadas.');
          } else if (error.response.status === 401 || error.response.status === 403) {
            toast.error('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
          } else {
            toast.error('Error inesperado al obtener evaluaciones.');
          }
        } else {
          toast.error('Error de red o el servidor no responde.');
        }
        console.error('Error al obtener evaluaciones pasadas:', error);
      }
    };

    if (token) {
      fetchPastAssessments();
    }
  }, [token, setPastAssessments]);

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Mis Evaluaciones Creadas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{padding: '8px', border: '1px solid #ddd'}}>Nombre</th>
            <th style={{padding: '8px', border: '1px solid #ddd'}}>Fecha de Creación</th>
            <th style={{padding: '8px', border: '1px solid #ddd'}}>Enlaces</th>
          </tr>
        </thead>
        <tbody>
          {pastAssessments.map((assessment) => (
            <tr key={assessment._id}>
              <td style={{padding: '8px', border: '1px solid #ddd'}}>{assessment.nombreEvaluacion}</td>
              <td style={{padding: '8px', border: '1px solid #ddd'}}>{new Date(assessment.fechaCreacion).toLocaleDateString('es-CL')}</td>
              <td style={{padding: '8px', border: '1px solid #ddd'}}>
                <a href={assessment.enlaceDoc} target="_blank" rel="noopener noreferrer">Documento</a>
                {assessment.enlaceForm && (
                  <a href={assessment.enlaceForm} target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px'}}>Formulario</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PastAssessments;
