import React, { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // Necesitarás una API Key para la API de Google Sheets

// Scopes necesarios para Google Picker y Google Sheets
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly', // Para Picker
  'https://www.googleapis.com/auth/spreadsheets.readonly', // Para leer Sheets
  'https://www.googleapis.com/auth/classroom.courses.readonly', // Para listar cursos de Classroom
  'https://www.googleapis.com/auth/classroom.coursework.students' // Para crear tareas en Classroom
];

function GoogleSheetPicker({ onSheetSelected }) {
  const tokenClient = useRef(null);

  useEffect(() => {
    // Cargar la biblioteca de la API de Google
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load('client', initGapiClient);
      window.gapi.load('picker', () => console.log('Picker API loaded'));
    };
    document.body.appendChild(script);

    // Cargar la biblioteca de autenticación de Google
    const gsiScript = document.createElement('script');
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.onload = () => {
      tokenClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: '', // Se define en el momento de la llamada
      });
    };
    document.body.appendChild(gsiScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(gsiScript);
    };
  }, []);

  const initGapiClient = async () => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES.join(' '),
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://sheets.googleapis.com/$discovery/rest?version=v4'],
      });
      console.log('gapi client initialized');
    } catch (error) {
      console.error('Error initializing gapi client', error);
      toast.error('Error al inicializar la integración con Google.');
    }
  };

  const createPicker = (accessToken) => {
    if (!window.google.picker) {
      toast.error('Google Picker no está cargado. Inténtalo de nuevo.');
      return;
    }

    const view = new window.google.picker.View(window.google.picker.ViewId.SPREADSHEETS);
    view.setMimeTypes('application/vnd.google-apps.spreadsheet');

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_EXPLORER)
      .setAppId(CLIENT_ID) // Usar el Client ID aquí
      .setOAuthToken(accessToken)
      .addView(view)
      .setCallback((data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const doc = data[window.google.picker.Response.DOCUMENTS][0];
          onSheetSelected({ id: doc.id, name: doc.name });
          toast.success(`Hoja seleccionada: ${doc.name}`);
        } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
          toast.info('Selección de hoja cancelada.');
        }
      })
      .build();
    picker.setVisible(true);
  };

  const handleAuthClick = () => {
    if (!tokenClient.current) {
      toast.error('Cliente de autenticación de Google no inicializado.');
      return;
    }

    tokenClient.current.callback = async (resp) => {
      if (resp.error) {
        console.error('Error de autenticación de Google:', resp.error);
        toast.error('Error de autenticación con Google.');
        return;
      }
      createPicker(resp.access_token);
    };

    if (window.gapi.client.getToken() === null) {
      // No hay token, solicitar consentimiento
      tokenClient.current.requestAccessToken({ prompt: 'consent' });
    } else {
      // Ya hay un token, usarlo directamente
      createPicker(window.gapi.client.getToken().access_token);
    }
  };

  return (
    <Button variant="contained" onClick={handleAuthClick}>
      Seleccionar Hoja de Google Drive
    </Button>
  );
}

export default GoogleSheetPicker;
