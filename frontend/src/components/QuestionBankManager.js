import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import {
  Box, Button, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress
} from '@mui/material';
import QuestionModal from './QuestionModal';

import Pagination from '@mui/material/Pagination'; // <-- Importa el componente de paginación

function QuestionBankManager() {
  const token = useStore((state) => state.token);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ oa: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);

  // Nuevos estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    try {
      const config = {
        headers: { 'x-auth-token': token },
        params: filters,
      };
      // Define la URL base de la API
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/questions`, config);
      setQuestions(response.data);
    } catch (error) {
      toast.error('No se pudieron cargar las preguntas.');
    } finally {
      setIsLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchQuestions();

  }, [fetchQuestions]);

  const handleFilterChange = (e) => {

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Gestión del Banco de Preguntas
        </Typography>
        <Button variant="contained" onClick={handleOpenCreateModal}>
          Crear Nueva Pregunta
        </Button>
      </Box>
      <Box component={Paper} sx={{ p: 2, mb: 2 }}>
        <TextField
          name="oa"
          label="Filtrar por OA"
          variant="outlined"
          size="small"
          value={filters.oa}
          onChange={handleFilterChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'f5f5f5' }}>
            <TableRow>
              <TableCell>Pregunta</TableCell>
              <TableCell>OA</TableCell>
              <TableCell>Dificultad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q._id}>
                  <TableCell>{q.pregunta}</TableCell>
                  <TableCell>{q.oa}</TableCell>
                  <TableCell>{q.dificultad}</TableCell>
                  <TableCell>
                    <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(q)}>Editar</Button>
                    <Button size="small" color="error">Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <QuestionModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        onQuestionUpdated={fetchQuestions} 
        editingQuestion={editingQuestion} 
      />
    </Container>
  );
}

export default QuestionBankManager;
