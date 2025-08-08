import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import {
  Box, Button, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScienceIcon from '@mui/icons-material/Science'; // Icono para el análisis IA

import QuestionModal from './QuestionModal';
import AnalyzeQuestionModal from './AnalyzeQuestionModal'; // Importar el nuevo modal
import GoogleSheetPicker from './GoogleSheetPicker';
import ImportQuestionsModal from './ImportQuestionsModal'; // Importar el nuevo modal de importación
import Pagination from '@mui/material/Pagination';

function QuestionBankManager() {
  const token = useStore((state) => state.token);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ oa: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [selectedQuestionForAnalysis, setSelectedQuestionForAnalysis] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Nuevo estado para el modal de importación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { 'x-auth-token': token },
        params: {
          oa: filters.oa,
          dificultad: filters.dificultad,
          pregunta: filters.pregunta,
          page: currentPage,
          limit: 10
        },
      };
      const response = await axios.get(`${API_URL}/api/questions`, config);
      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('No se pudieron cargar las preguntas.');
    } finally {
      setIsLoading(false);
    }
  }, [token, filters, currentPage, API_URL]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset page on new filter
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // --- Handlers para Modal de Edición/Creación ---
  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingQuestion(null);
  };

  // --- Handlers para Modal de Análisis ---
  const handleOpenAnalyzeModal = (question) => {
    setSelectedQuestionForAnalysis(question);
    setIsAnalyzeModalOpen(true);
  };

  const handleCloseAnalyzeModal = () => {
    setIsAnalyzeModalOpen(false);
    setSelectedQuestionForAnalysis(null);
  };

  const handleSheetSelected = async ({ id, name }) => {
    setIsLoading(true);
    try {
      const config = {
        headers: { 'x-auth-token': token },
      };
      await axios.post(`${API_URL}/api/sheets/import-questions`, { sheetId: id }, config);
      toast.success(`Preguntas importadas exitosamente desde "${name}".`);
      fetchQuestions(); // Refresh the question list
    } catch (error) {
      console.error('Error importing questions from Google Sheet:', error);
      toast.error('Error al importar preguntas desde la hoja de cálculo.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers para Modal de Importación ---
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const handleImportCSV = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.post(`${API_URL}/api/import/csv`, formData, config);
      toast.success('Preguntas CSV importadas exitosamente.');
      fetchQuestions();
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Error al importar preguntas desde CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportJSON = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.post(`${API_URL}/api/import/json`, formData, config);
      toast.success('Preguntas JSON importadas exitosamente.');
      fetchQuestions();
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('Error al importar preguntas desde JSON.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Banco de Preguntas</Typography>
        <Box>
          <Button variant="contained" onClick={handleOpenCreateModal} sx={{ mr: 1 }}>Crear Pregunta</Button>
          <Button variant="outlined" onClick={handleOpenImportModal} sx={{ mr: 1 }}>Importar Preguntas</Button>
          <GoogleSheetPicker onSheetSelect={handleSheetSelected} />
        </Box>
      </Box>
      <Box component={Paper} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
        <TextField name="oa" label="Filtrar por OA" variant="outlined" size="small" value={filters.oa} onChange={handleFilterChange} />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Dificultad</InputLabel>
          <Select
            name="dificultad"
            value={filters.dificultad || ''}
            onChange={handleFilterChange}
            label="Dificultad"
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Baja">Baja</MenuItem>
            <MenuItem value="Intermedio">Intermedio</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
          </Select>
        </FormControl>
        <TextField name="pregunta" label="Buscar por Pregunta" variant="outlined" size="small" value={filters.pregunta || ''} onChange={handleFilterChange} />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ width: '50%' }}>Pregunta</TableCell>
              <TableCell>OA</TableCell>
              <TableCell>Dificultad</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q._id}>
                  <TableCell>{q.pregunta}</TableCell>
                  <TableCell>{q.oa}</TableCell>
                  <TableCell>{q.dificultad}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenAnalyzeModal(q)} title="Analizar con IA">
                      <ScienceIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenEditModal(q)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" title="Eliminar">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </Box>
      <QuestionModal 
        open={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        onQuestionUpdated={fetchQuestions} 
        editingQuestion={editingQuestion} 
      />
      <AnalyzeQuestionModal
        open={isAnalyzeModalOpen}
        handleClose={handleCloseAnalyzeModal}
        question={selectedQuestionForAnalysis}
      />
      <ImportQuestionsModal
        open={isImportModalOpen}
        handleClose={handleCloseImportModal}
        onImportCSV={handleImportCSV}
        onImportJSON={handleImportJSON}
      />
    </Container>
  );
}

export default QuestionBankManager;