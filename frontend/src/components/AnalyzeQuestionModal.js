import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useStore from '../store';
import {
  Button,
  Modal,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  TextField
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

function AnalyzeQuestionModal({ open, handleClose, question }) {
  const { token } = useStore();
  const [analysis, setAnalysis] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  const [adaptationType, setAdaptationType] = useState('');
  const [adaptedResult, setAdaptedResult] = useState(null);
  const [isLoadingAdaptation, setIsLoadingAdaptation] = useState(false);

  const handleAnalyze = async () => {
    if (!question) return;
    setIsLoadingAnalysis(true);
    setAnalysis('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.post(`${API_URL}/api/gemini/analyze-question`, question, config);
      setAnalysis(response.data.analysis);
      toast.success('Análisis completado.');
    } catch (error) {
      toast.error('No se pudo completar el análisis.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleAdapt = async () => {
    if (!question || !adaptationType) {
      return toast.warn('Por favor, describe la adaptación requerida.');
    }
    setIsLoadingAdaptation(true);
    setAdaptedResult(null);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = { question, adaptationType };
      const response = await axios.post(`${API_URL}/api/gemini/adapt-question`, body, config);
      setAdaptedResult(response.data);
      toast.success('Pregunta adaptada con éxito.');
    } catch (error) {
      toast.error('No se pudo adaptar la pregunta.');
    } finally {
      setIsLoadingAdaptation(false);
    }
  };

  const handleModalClose = () => {
    setAnalysis('');
    setAdaptationType('');
    setAdaptedResult(null);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Análisis y Adaptación de Ítem con IA</Typography>
        {question && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1">Pregunta Original:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{question.pregunta}</Typography>
          </Paper>
        )}
        
        <Divider sx={{ my: 3 }}>Análisis Pedagógico</Divider>
        <Button onClick={handleAnalyze} disabled={isLoadingAnalysis} variant="contained">
          {isLoadingAnalysis ? <CircularProgress size={24} /> : 'Analizar Calidad del Ítem'}
        </Button>
        {analysis && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analysis}</Typography>
          </Paper>
        )}

        <Divider sx={{ my: 3 }}>Adaptación Inteligente para NEE</Divider>
        <TextField
          label="Describir la necesidad de adaptación"
          fullWidth
          multiline
          rows={2}
          margin="normal"
          value={adaptationType}
          onChange={(e) => setAdaptationType(e.target.value)}
          helperText="Ej: Simplificar lenguaje para DEA, dividir en pasos para TDAH"
        />
        <Button onClick={handleAdapt} disabled={isLoadingAdaptation} variant="contained">
          {isLoadingAdaptation ? <CircularProgress size={24} /> : 'Generar Adaptación'}
        </Button>
        {adaptedResult && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6">Pregunta Adaptada:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{adaptedResult.adaptedQuestion.pregunta}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Justificación:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{adaptedResult.justification}</Typography>
          </Paper>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleModalClose}>Cerrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AnalyzeQuestionModal;