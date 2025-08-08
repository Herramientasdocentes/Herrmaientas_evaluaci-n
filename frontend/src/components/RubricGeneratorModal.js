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
  TextField,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

function RubricGeneratorModal({ open, handleClose }) {
  const { token } = useStore();
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [levels, setLevels] = useState('Logrado, En Desarrollo, Por Lograr');
  const [rubric, setRubric] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description || !criteria || !levels) {
      return toast.warn('Por favor, completa todos los campos para generar la rúbrica.');
    }
    setIsLoading(true);
    setRubric('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = { description, criteria, levels };
      const response = await axios.post(`${API_URL}/api/gemini/generate-rubric`, body, config);
      setRubric(response.data.rubric);
      toast.success('Rúbrica generada con éxito.');
    } catch (error) {
      console.error('Error al generar la rúbrica:', error);
      toast.error('No se pudo generar la rúbrica.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setDescription('');
    setCriteria('');
    setLevels('Logrado, En Desarrollo, Por Lograr');
    setRubric('');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Generador de Rúbricas con IA</Typography>
        
        <TextField
          label="Descripción de la Tarea o Pregunta a Evaluar"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Criterios de Evaluación (separados por comas)"
          fullWidth
          margin="normal"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          helperText="Ej: Coherencia, Uso de evidencia, Claridad de la escritura"
        />
        <TextField
          label="Niveles de Logro (separados por comas)"
          fullWidth
          margin="normal"
          value={levels}
          onChange={(e) => setLevels(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={isLoading} variant="contained" sx={{ mt: 1 }}>
          {isLoading ? <CircularProgress size={24} /> : 'Generar Rúbrica'}
        </Button>

        {rubric && (
          <Paper variant="outlined" sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Rúbrica Generada:</Typography>
            <Box sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              <ReactMarkdown>{rubric}</ReactMarkdown>
            </Box>
          </Paper>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleModalClose}>Cerrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RubricGeneratorModal;
