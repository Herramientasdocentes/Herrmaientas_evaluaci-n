
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import useStore from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const token = useStore((state) => state.token);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Asistente de Evaluaciones Anluis</h1>
        {/* Renderizado condicional: si hay token, muestra el Dashboard, si no, el Login */}
        {token ? <Dashboard /> : <LoginPage />}
      </header>
      {/* Contenedor para las notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
