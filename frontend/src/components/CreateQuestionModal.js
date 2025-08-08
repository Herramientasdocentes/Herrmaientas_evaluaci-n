import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useStore from '../store';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Divider
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

function CreateQuestionModal({ open, handleClose, onQuestionCreated }) {
  const { token } = useStore();
  const [formData, setFormData] = useState({
    pregunta: '',
    opcionA: '',
    opcionB: '',
    opcionC: '',
    opcionD: '',
    respuestaCorrecta: 'A',
    puntaje: 1,
    oa: '',
    indicador: '',
    habilidad: '',
    dificultad: 'Intermedio',
  });
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = async () => {
    if (!formData.oa || !formData.dificultad || !aiContext) {
      return toast.warn('Para generar con IA, por favor completa el OA, la dificultad y el contexto.');
    }
    setIsGenerating(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        objetivoAprendizaje: formData.oa,
        dificultad: formData.dificultad,
        contexto: aiContext,
      };
      const response = await axios.post(`${API_URL}/api/gemini/generate-question`, body, config);
      const { pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta } = response.data;
      
      setFormData(prev => ({
        ...prev,
        pregunta,
        opcionA,
        opcionB,
        opcionC,
        opcionD,
        respuestaCorrecta,
      }));
      toast.success('¡Pregunta generada por IA! Revisa y ajusta si es necesario.');
    } catch (error) {
      console.error('Error al generar pregunta con IA:', error);
      toast.error('No se pudo generar la pregunta con IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.post(`${API_URL}/api/questions`, formData, config);
      toast.success('¡Pregunta creada exitosamente!');
      onQuestionCreated(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al crear la pregunta:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.errors?.[0]?.msg || 'No se pudo crear la pregunta.';
      toast.error(errorMsg);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2">Crear Nueva Pregunta</Typography>
        
        <Divider sx={{ my: 2 }}>Asistente de IA</Divider>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Completa los siguientes campos y la IA generará una pregunta por ti.
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Objetivo de Aprendizaje (OA)"
          name="oa"
          value={formData.oa}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Dificultad</InputLabel>
          <Select name="dificultad" value={formData.dificultad} onChange={handleChange}>
            <MenuItem value="Fácil">Fácil</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
            <MenuItem value="Difícil">Difícil</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          label="Contexto de la Pregunta (Ej: Deportes, Historia, etc.)"
          value={aiContext}
          onChange={(e) => setAiContext(e.target.value)}
          multiline
          rows={2}
        />
        <Button onClick={handleGenerateAI} disabled={isGenerating} variant="outlined" sx={{ mt: 1 }}>
          {isGenerating ? <CircularProgress size={24} /> : 'Generar con IA'}
        </Button>
        <Divider sx={{ my: 2 }}>Datos de la Pregunta (Puedes editar lo generado)</Divider>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Texto de la Pregunta"
          name="pregunta"
          value={formData.pregunta}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField margin="normal" required fullWidth label="Opción A" name="opcionA" value={formData.opcionA} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Opción B" name="opcionB" value={formData.opcionB} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Opción C" name="opcionC" value={formData.opcionC} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Opción D" name="opcionD" value={formData.opcionD} onChange={handleChange} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Respuesta Correcta</InputLabel>
          <Select name="respuestaCorrecta" value={formData.respuestaCorrecta} onChange={handleChange}>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </Select>
        </FormControl>

        <TextField margin="normal" fullWidth label="Habilidad" name="habilidad" value={formData.habilidad} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Puntaje" name="puntaje" type="number" value={formData.puntaje} onChange={handleChange} />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button type="submit" variant="contained">Crear Pregunta</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreateQuestionModal;
