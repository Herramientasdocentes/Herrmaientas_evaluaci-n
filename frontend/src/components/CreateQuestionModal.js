
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

const initialState = {
  pregunta: '', opcionA: '', opcionB: '', opcionC: '', opcionD: '',
  respuestaCorrecta: 'A', puntaje: 1, oa: '', dificultad: 'Intermedio'
};

function QuestionModal({ open, onClose, onQuestionUpdated, editingQuestion }) {
  const token = useStore((state) => state.token);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingQuestion) {
      setFormData(editingQuestion);
    } else {
      setFormData(initialState);
    }
  }, [editingQuestion, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-auth-token': token } };
      if (editingQuestion) {
        await axios.put(`http://localhost:5000/api/questions/${editingQuestion._id}`, formData, config);
        toast.success('¡Pregunta actualizada con éxito!');
      } else {
        await axios.post('http://localhost:5000/api/questions', formData, config);
        toast.success('¡Pregunta creada con éxito!');
      }
      onQuestionUpdated();
      onClose();
    } catch (error) {
      toast.error('Ocurrió un error.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingQuestion ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}</DialogTitle>
      <DialogContent>
        <TextField name="pregunta" label="Enunciado" fullWidth margin="dense" value={formData.pregunta} onChange={handleChange} />
        <TextField name="opcionA" label="Alternativa A" fullWidth margin="dense" value={formData.opcionA} onChange={handleChange} />
        <TextField name="opcionB" label="Alternativa B" fullWidth margin="dense" value={formData.opcionB} onChange={handleChange} />
        <TextField name="opcionC" label="Alternativa C" fullWidth margin="dense" value={formData.opcionC} onChange={handleChange} />
        <TextField name="opcionD" label="Alternativa D" fullWidth margin="dense" value={formData.opcionD} onChange={handleChange} />
        <FormControl fullWidth margin="dense">
          <InputLabel>Respuesta Correcta</InputLabel>
          <Select name="respuestaCorrecta" value={formData.respuestaCorrecta} label="Respuesta Correcta" onChange={handleChange}>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </Select>
        </FormControl>
        <TextField name="oa" label="OA" fullWidth margin="dense" value={formData.oa} onChange={handleChange} />
        {/* Aquí se pueden añadir más campos como puntaje, habilidad, etc. */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar Cambios</Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuestionModal;
