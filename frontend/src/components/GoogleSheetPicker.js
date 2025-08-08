import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleSheetPicker = ({ onSheetSelect }) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/sheets/drive-files', config);
        if (Array.isArray(res.data)) {
          setSheets(res.data);
        } else {
          console.error('API did not return an array for sheets:', res.data);
          setSheets([]); // Ensure sheets is always an array
        }
      } catch (err) {
        console.error('Error fetching Google Sheets:', err);
        setError('Error al cargar las hojas de cálculo. Asegúrate de haber iniciado sesión con Google y de tener permisos.');
        toast.error('Error al cargar las hojas de cálculo.');
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) {
    return <div>Cargando hojas de cálculo de Google Drive...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="google-sheet-picker">
      <h3>Selecciona una Hoja de Cálculo de Google Drive</h3>
      {sheets && Array.isArray(sheets) && sheets.length === 0 ? (
        <p>No se encontraron hojas de cálculo en tu Google Drive. Asegúrate de que existan y de tener los permisos adecuados.</p>
      ) : (
        <ul className="list-group">
          {sheets && Array.isArray(sheets) && sheets.map((sheet) => (
            <li
              key={sheet.id}
              className="list-group-item list-group-item-action"
              onClick={() => onSheetSelect(sheet)}
              style={{ cursor: 'pointer' }}
            >
              {sheet.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleSheetPicker;