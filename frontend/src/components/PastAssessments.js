import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

function PastAssessments() {
  const { token } = useStore();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [assessmentToEdit, setAssessmentToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editObjective, setEditObjective] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`${API_URL}/api/assessment/mis-evaluaciones`, config);
      setAssessments(response.data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Error al cargar las evaluaciones.');
      toast.error('Error al cargar las evaluaciones.');
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (assessment) => {
    setAssessmentToDelete(assessment);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAssessmentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!assessmentToDelete) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`${API_URL}/api/assessment/${assessmentToDelete._id}`, config);
      toast.success('Evaluación eliminada exitosamente.');
      fetchAssessments(); // Refetch assessments
    } catch (err) {
      console.error('Error deleting assessment:', err);
      toast.error('Error al eliminar la evaluación.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = (assessment) => {
    setAssessmentToEdit(assessment);
    setEditName(assessment.nombreEvaluacion);
    setEditObjective(assessment.objetivo);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setAssessmentToEdit(null);
    setEditName('');
    setEditObjective('');
  };

  const confirmEdit = async () => {
    if (!assessmentToEdit) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        nombreEvaluacion: editName,
        objetivo: editObjective,
      };
      await axios.put(`${API_URL}/api/assessment/${assessmentToEdit._id}`, body, config);
      toast.success('Evaluación actualizada exitosamente.');
      fetchAssessments(); // Refetch assessments
    } catch (err) {
      console.error('Error updating assessment:', err);
      toast.error('Error al actualizar la evaluación.');
    } finally {
      handleCloseEditDialog();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchAssessments} variant="contained" sx={{ mt: 2 }}>Reintentar</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mis Evaluaciones</Typography>
      {assessments.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No tienes evaluaciones creadas aún.</Typography>
      ) : (
        <List component={Paper} elevation={2}>
          {assessments.map((assessment) => (
            <ListItem key={assessment._id} divider sx={{ mb: 2 }}>
              <ListItemText 
                primary={assessment.nombreEvaluacion}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Objetivo: {assessment.objetivo}
                    </Typography>
                    <br/>
                    <Typography component="span" variant="body2" color="textSecondary">
                      Creada: {new Date(assessment.fechaCreacion).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                {assessment.enlaces && assessment.enlaces.map((link, idx) => (
                  <React.Fragment key={idx}>
                    <IconButton 
                      edge="end" 
                      aria-label="view-doc"
                      onClick={() => window.open(link.urlDoc, '_blank')}
                      title={`Ver Documento ${link.forma}`}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="view-form"
                      onClick={() => window.open(link.urlForm, '_blank')}
                      title={`Ver Formulario ${link.forma}`}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </React.Fragment>
                ))}
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(assessment)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(assessment)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar la evaluación "{assessmentToDelete?.nombreEvaluacion}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={confirmDelete} autoFocus color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Editar Evaluación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Puedes editar el nombre y el objetivo de la evaluación.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre de la Evaluación"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="objective"
            label="Objetivo"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editObjective}
            onChange={(e) => setEditObjective(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={confirmEdit} color="primary">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PastAssessments;
