import React from 'react';
import useStore from '../store';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function QuestionPanel() {
  const { questions, isLoading, addQuestionToEvaluation } = useStore();

  const handleAddClick = (question) => {
    addQuestionToEvaluation(question);
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
      <Typography variant="h6" gutterBottom>Preguntas del Banco</Typography>
      {questions.length > 0 ? (
        <ol>
          {questions.map((q, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span>{q.Question}</span>
              <IconButton color="primary" onClick={() => handleAddClick(q)} size="small">
                <AddIcon />
              </IconButton>
            </li>
          ))}
        </ol>
      ) : (
        <Typography variant="body2">Selecciona un archivo para ver sus preguntas.</Typography>
      )}
    </Box>
  );
}

export default QuestionPanel;
