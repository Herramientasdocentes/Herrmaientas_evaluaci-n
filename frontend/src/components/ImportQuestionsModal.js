import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, AppBar, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import GoogleSheetPicker from './GoogleSheetPicker'; // Importar GoogleSheetPicker

const Input = styled('input')({
  display: 'none',
});

const ImportQuestionsModal = ({ open, handleClose, onImportCSV, onImportJSON, onImportGoogleSheet }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); // 0 for file, 1 for Google Sheet
  const [selectedSheet, setSelectedSheet] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedFile(null); // Clear file selection when changing tabs
    setSelectedSheet(null); // Clear sheet selection when changing tabs
  };

  const handleUpload = (type) => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }

    if (type === 'csv') {
      onImportCSV(selectedFile);
    } else if (type === 'json') {
      onImportJSON(selectedFile);
    }
    setSelectedFile(null);
    handleClose();
  };

  const handleSheetSelected = (sheet) => {
    setSelectedSheet(sheet);
  };

  const handleImportSheet = () => {
    if (selectedSheet) {
      onImportGoogleSheet(selectedSheet);
      setSelectedSheet(null);
      handleClose();
    } else {
      alert('Por favor, selecciona una hoja de cálculo de Google.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Importar Preguntas</DialogTitle>
      <AppBar position="static" color="default">
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="Desde Archivo (CSV/JSON)" />
          <Tab label="Desde Google Sheets" />
        </Tabs>
      </AppBar>
      <DialogContent dividers>
        {selectedTab === 0 && (
          <Box>
            <Typography variant="body1" gutterBottom>Selecciona un archivo CSV o JSON para importar preguntas.</Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <label htmlFor="contained-button-file">
                <Input id="contained-button-file" type="file" onChange={handleFileChange} accept=".csv,.json" />
                <Button variant="contained" component="span">
                  Seleccionar Archivo
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                  {selectedFile.name}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <Typography variant="body1" gutterBottom>Selecciona una hoja de cálculo de Google Drive para importar preguntas.</Typography>
            <GoogleSheetPicker onSheetSelect={handleSheetSelected} />
            {selectedSheet && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Hoja seleccionada: <strong>{selectedSheet.name}</strong>
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        {selectedTab === 0 && (
          <>
            <Button onClick={() => handleUpload('csv')} disabled={!selectedFile || !selectedFile.name.endsWith('.csv')}>Importar CSV</Button>
            <Button onClick={() => handleUpload('json')} disabled={!selectedFile || !selectedFile.name.endsWith('.json')}>Importar JSON</Button>
          </>
        )}
        {selectedTab === 1 && (
          <Button onClick={handleImportSheet} disabled={!selectedSheet}>Importar desde Google Sheet</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportQuestionsModal;
