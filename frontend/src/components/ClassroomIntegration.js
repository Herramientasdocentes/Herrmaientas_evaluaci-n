import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, TextField,
  Typography, CircularProgress, Container
} from '@mui/material';

function ClassroomIntegration({ evaluationLinks, evaluationTitle }) {
  const token = useStore((state) => state.token);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLink, setSelectedLink] = useState(''); // Estado para el enlace seleccionado
  const [assignmentTitle, setAssignmentTitle] = useState(evaluationTitle || '');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Si solo hay un enlace, pre-seleccionarlo
    if (evaluationLinks && evaluationLinks.length === 1) {
      setSelectedLink(evaluationLinks[0].urlDoc); // O urlForm, dependiendo de lo que se quiera publicar
    }
    // Si el título de la evaluación cambia, actualizar el título de la tarea
    setAssignmentTitle(evaluationTitle || '');
  }, [evaluationLinks, evaluationTitle]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const config = { headers: { 'x-auth-token': token } };
        const response = await axios.get(`${API_URL}/api/classroom/courses`, config);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching Classroom courses:', error);
        toast.error('Error al cargar los cursos de Google Classroom.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token, API_URL]);

  const handleCreateAssignment = async () => {
    if (!selectedCourse || !assignmentTitle || !selectedLink) {
      toast.error('Por favor, selecciona un curso, una forma de evaluación y proporciona un título.');
      return;
    }

    setIsLoading(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const assignmentData = {
        title: assignmentTitle,
        description: assignmentDescription,
        link: selectedLink, // Usar el enlace seleccionado
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
      };

      await axios.post(
        `${API_URL}/api/classroom/courses/${selectedCourse}/assignments`,
        assignmentData,
        config
      );
      toast.success('Tarea creada en Google Classroom exitosamente!');
    } catch (error) {
      console.error('Error creating Classroom assignment:', error.response?.data || error.message);
      toast.error('Error al crear la tarea en Google Classroom.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Publicar en Google Classroom
      </Typography>

      {isLoading && !courses.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="course-select-label">Seleccionar Curso</InputLabel>
            <Select
              labelId="course-select-label"
              value={selectedCourse}
              label="Seleccionar Curso"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Título de la Tarea"
            fullWidth
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            required
          />

          <FormControl fullWidth required>
            <InputLabel id="form-select-label">Seleccionar Forma de Evaluación</InputLabel>
            <Select
              labelId="form-select-label"
              value={selectedLink}
              label="Seleccionar Forma de Evaluación"
              onChange={(e) => setSelectedLink(e.target.value)}
            >
              {evaluationLinks.map((link, index) => (
                <MenuItem key={index} value={link.urlDoc}>
                  {`${link.forma} (Documento)`}
                </MenuItem>
              ))}
              {evaluationLinks.map((link, index) => (
                <MenuItem key={`form-${index}`} value={link.urlForm}>
                  {`${link.forma} (Formulario)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descripción (Opcional)"
            fullWidth
            multiline
            rows={3}
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
          />
          <TextField
            label="Fecha de Entrega (Opcional)"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <TextField
            label="Hora de Entrega (Opcional)"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAssignment}
            disabled={isLoading || !selectedCourse || !assignmentTitle || !selectedLink}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Crear Tarea en Classroom'}
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default ClassroomIntegration;