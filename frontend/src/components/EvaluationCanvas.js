import React, { useState } from 'react';
import useStore from '../store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, TextField, Typography, Paper, Link, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ClassroomIntegration from './ClassroomIntegration';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

function EvaluationCanvas() {
  const { evaluationQuestions, setEvaluationQuestions, token } = useStore();
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [numForms, setNumForms] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [showClassroomIntegration, setShowClassroomIntegration] = useState(false);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(evaluationQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvaluationQuestions(items);
  };

  const handleGenerate = async () => {
    if (!nombre || !objetivo || evaluationQuestions.length === 0) {
      return toast.warn('Por favor, completa el nombre, el objetivo y añade al menos una pregunta.');
    }
    setIsGenerating(true);
    setGeneratedLinks([]);
    setShowClassroomIntegration(false);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        nombreEvaluacion: nombre,
        objetivo,
        questionIds: evaluationQuestions.map(q => q._id),
        numForms: numForms, // Enviar el número de formas
      };
      const response = await axios.post(`${API_URL}/api/evaluaciones`, body, config);
      toast.success('¡Evaluaciones generadas con éxito!');
      setGeneratedLinks(response.data.enlaces); // Guardar el array de enlaces
      if (response.data.enlaces.length > 0) {
        setShowClassroomIntegration(true); // Mostrar la integración con Classroom
      }
      // Limpiar el canvas
      setNombre('');
      setObjetivo('');
      setEvaluationQuestions([]);
    } catch (error) {
      console.error('Error al generar la evaluación:', error);
      toast.error('No se pudo generar la evaluación. Revisa la configuración de la API de Google.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ width: '45%', padding: '16px' }}>
      <Typography variant="h6" gutterBottom>Mi Evaluación</Typography>
      <TextField
        label="Nombre de la Evaluación"
        fullWidth
        margin="normal"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <TextField
        label="Objetivo de la Evaluación"
        fullWidth
        margin="normal"
        multiline
        rows={2}
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="num-forms-label">Número de Formas</InputLabel>
        <Select
          labelId="num-forms-label"
          value={numForms}
          label="Número de Formas"
          onChange={(e) => setNumForms(e.target.value)}
        >
          <MenuItem value={1}>1 Forma</MenuItem>
          <MenuItem value={2}>2 Formas (A/B)</MenuItem>
          <MenuItem value={3}>3 Formas (A/B/C)</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Preguntas (Arrastra para ordenar):</Typography>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="evaluation">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ minHeight: '150px', border: '1px dashed grey', p: 1, mt: 1 }}>
              {evaluationQuestions.map((q, index) => (
                <Draggable key={q._id} draggableId={q._id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ padding: '8px', marginBottom: '8px', ...provided.draggableProps.style }}
                    >
                      {q.pregunta}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {evaluationQuestions.length === 0 && (
                <Typography variant="body2" color="textSecondary" align="center">Añade preguntas desde el panel izquierdo.</Typography>
              )}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generando...' : 'Generar Evaluación'}
      </Button>

      {generatedLinks.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Enlaces Generados:</Typography>
          {generatedLinks.map((link, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{link.forma}</Typography>
              <Link href={link.urlDoc} target="_blank" rel="noopener">Ver Google Doc</Link><br/>
              <Link href={link.urlForm} target="_blank" rel="noopener">Ver Google Form</Link>
            </Box>
          ))}
        </Box>
      )}

      {showClassroomIntegration && generatedLinks.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Publicar en Classroom</Typography>
          <ClassroomIntegration
            evaluationLinks={generatedLinks} // Pasar todos los enlaces
            evaluationTitle={nombre}
          />
        </Box>
      )}
    </Paper>
  );
}

export default EvaluationCanvas;
