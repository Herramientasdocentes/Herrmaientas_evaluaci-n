import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { Box, CircularProgress, Typography, IconButton, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateQuestionModal from './CreateQuestionModal';

// El panel ahora puede recibir una lista de preguntas como prop
function QuestionPanel({ externalQuestions, externalSourceTitle }) {
  const {
    questions: bankQuestions, // Preguntas del banco principal (store)
    isLoading,
    addQuestionToEvaluation,
    setQuestions: setBankQuestions
  } = useStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  // Determinar qué preguntas mostrar
  useEffect(() => {
    if (externalQuestions) {
      setDisplayQuestions(externalQuestions);
    } else {
      setDisplayQuestions(bankQuestions);
    }
  }, [externalQuestions, bankQuestions]);

  const handleAddClick = (question) => {
    addQuestionToEvaluation(question);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleQuestionCreated = (newQuestion) => {
    // Si estamos viendo el banco, lo actualizamos. Si no, no hacemos nada.
    if (!externalQuestions) {
      setBankQuestions([newQuestion, ...bankQuestions]);
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', padding: '16px', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {externalSourceTitle ? `Preguntas de: ${externalSourceTitle}` : 'Banco de Preguntas'}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {isLoading && displayQuestions.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : displayQuestions.length > 0 ? (
        <ol style={{ paddingLeft: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
          {displayQuestions.map((q, index) => (
            <li key={q._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ flex: 1 }}>{q.pregunta}</span>
              <IconButton color="primary" onClick={() => handleAddClick(q)} size="small" title="Añadir a mi evaluación">
                <AddIcon />
              </IconButton>
            </li>
          ))}
        </ol>
      ) : (
        <Typography variant="body2" color="textSecondary" align="center">
          {externalSourceTitle ? 'No se encontraron preguntas en esta hoja.' : 'Selecciona un banco o importa preguntas para verlas aquí.'}
        </Typography>
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