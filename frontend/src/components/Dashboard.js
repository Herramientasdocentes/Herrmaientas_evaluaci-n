import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import QuestionPanel from './QuestionPanel';
import EvaluationCanvas from './EvaluationCanvas';
import RubricGeneratorModal from './RubricGeneratorModal';
import GoogleSheetPicker from './GoogleSheetPicker';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  CircularProgress 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';
import ClearIcon from '@mui/icons-material/Clear';

function Dashboard() {
  const { token, logout } = useStore();
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [sheetQuestions, setSheetQuestions] = useState(null);
  const [sheetInfo, setSheetInfo] = useState({ title: '', isLoading: false });

  const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

  useEffect(() => {
    if (!token) logout();
  }, [token, logout]);

  const handleOpenRubricModal = () => setIsRubricModalOpen(true);
  const handleCloseRubricModal = () => setIsRubricModalOpen(false);

  const handleSheetSelected = async ({ id, name }) => {
    setSheetInfo({ title: name, isLoading: true });
    setSheetQuestions(null); // Limpiar preguntas anteriores
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`${API_URL}/api/sheets/${id}/questions`, config);
      setSheetQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions from sheet:', error);
    } finally {
      setSheetInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleClearSheet = () => {
    setSheetQuestions(null);
    setSheetInfo({ title: '', isLoading: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Asistente de Evaluaciones Anluis
          </Typography>
          <GoogleSheetPicker onSheetSelected={handleSheetSelected} />
          <Button 
            variant="contained"
            color="secondary"
            startIcon={<ArticleIcon />}
            onClick={handleOpenRubricModal}
            sx={{ mx: 2 }}
          >
            Generador de Rúbricas
          </Button>
          <IconButton color="inherit" onClick={logout} title="Cerrar Sesión">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {sheetInfo.isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <QuestionPanel 
                externalQuestions={sheetQuestions} 
                externalSourceTitle={sheetInfo.title} 
              />
            )}
            {sheetQuestions && (
              <Button startIcon={<ClearIcon />} onClick={handleClearSheet} sx={{ mt: 1 }}>
                Limpiar y ver Banco Principal
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            <EvaluationCanvas />
          </Grid>
        </Grid>
      </Container>

      <RubricGeneratorModal 
        open={isRubricModalOpen} 
        handleClose={handleCloseRubricModal} 
      />
    </Box>
  );
}

export default Dashboard;
