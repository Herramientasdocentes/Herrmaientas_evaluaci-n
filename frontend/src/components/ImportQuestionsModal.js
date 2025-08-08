import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const ImportQuestionsModal = ({ open, handleClose, onImportCSV, onImportJSON }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importar Preguntas</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => handleUpload('csv')} disabled={!selectedFile || !selectedFile.name.endsWith('.csv')}>Importar CSV</Button>
        <Button onClick={() => handleUpload('json')} disabled={!selectedFile || !selectedFile.name.endsWith('.json')}>Importar JSON</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportQuestionsModal;
