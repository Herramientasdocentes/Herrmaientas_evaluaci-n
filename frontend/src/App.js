
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const token = useStore((state) => state.token);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Asistente de Evaluaciones Anluis</h1>
        {token ? <Dashboard /> : <LoginPage />}
      </header>
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
