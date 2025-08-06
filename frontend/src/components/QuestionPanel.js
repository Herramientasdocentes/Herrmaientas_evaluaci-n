import React, { useState } from 'react';
import useStore from '../store';
import { Box, CircularProgress, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateQuestionModal from './CreateQuestionModal'; // Importamos el modal

function QuestionPanel() {
  const { questions, isLoading, addQuestionToEvaluation, setQuestions } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = (question) => {
    addQuestionToEvaluation(question);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Callback para cuando se crea una pregunta nueva
  const handleQuestionCreated = (newQuestion) => {
    // Añadimos la nueva pregunta al principio de la lista existente
    setQuestions([newQuestion, ...questions]);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '45%', border: '1px solid #ccc', padding: '10px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>Preguntas del Banco</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Pregunta
        </Button>
      </Box>

      {questions.length > 0 ? (
        <ol>
          {questions.map((q, index) => (
            <li key={q._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span>{q.pregunta}</span>
              <IconButton color="primary" onClick={() => handleAddClick(q)} size="small">
                <AddIcon />
              </IconButton>
            </li>
          ))}
        </ol>
      ) : (
        <Typography variant="body2">Selecciona un banco de preguntas o crea una nueva.</Typography>
      )}

      <CreateQuestionModal
        open={modalOpen}
        handleClose={handleCloseModal}
        onQuestionCreated={handleQuestionCreated}
      />
    </Box>
  );
}

export default QuestionPanel;
