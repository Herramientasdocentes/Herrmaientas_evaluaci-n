import React, { useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

function PastAssessments() {
  const { token, pastAssessments, setPastAssessments } = useStore();

  useEffect(() => {
    const fetchPastAssessments = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const response = await axios.get(`${API_URL}/api/evaluaciones/mis-evaluaciones`, config);
        setPastAssessments(response.data);
      } catch (error) {
        console.error('Error al obtener evaluaciones pasadas:', error);
        // No mostramos toast de error si es un 404 (no encontrado), simplemente no se muestran datos.
        if (error.response && error.response.status !== 404) {
            toast.error('No se pudieron cargar las evaluaciones anteriores.');
        }
      }
    };

    if (token) {
      fetchPastAssessments();
    }
  }, [token, setPastAssessments]);

  return (
    <Box sx={{ marginTop: '40px' }}>
      <Typography variant="h6" gutterBottom>Mis Evaluaciones Creadas</Typography>
      {pastAssessments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Enlaces</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pastAssessments.map((assessment) => (
                <TableRow key={assessment._id}>
                  <TableCell>{assessment.nombreEvaluacion}</TableCell>
                  <TableCell>{new Date(assessment.fechaCreacion).toLocaleDateString('es-CL')}</TableCell>
                  <TableCell>
                    <Link href={assessment.enlaceDoc} target="_blank" rel="noopener noreferrer" sx={{ mr: 2 }}>Doc</Link>
                    <Link href={assessment.enlaceForm} target="_blank" rel="noopener noreferrer">Form</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="textSecondary">No has creado ninguna evaluación todavía.</Typography>
      )}
    </Box>
  );
}

export default PastAssessments;