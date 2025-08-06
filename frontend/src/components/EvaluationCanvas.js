import React, { useState } from 'react';
import useStore from '../store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, TextField, Typography, Paper, Link } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

function EvaluationCanvas() {
  const { evaluationQuestions, setEvaluationQuestions, token } = useStore();
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        nombreEvaluacion: nombre,
        objetivo,
        questionIds: evaluationQuestions.map(q => q._id),
      };
      const response = await axios.post(`${API_URL}/api/evaluaciones`, body, config);
      toast.success(
        <div>
          <p>¡Evaluación generada con éxito!</p>
          <Link href={response.data.enlaceDoc} target="_blank" rel="noopener">Ver Google Doc</Link><br/>
          <Link href={response.data.enlaceForm} target="_blank" rel="noopener">Ver Google Form</Link>
        </div>
      );
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
    </Paper>
  );
}

export default EvaluationCanvas;