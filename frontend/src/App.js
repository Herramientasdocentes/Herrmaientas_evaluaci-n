import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import useStore from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';

function App() {
  const token = useStore((state) => state.token);
  const [showRegister, setShowRegister] = useState(false);

  const renderContent = () => {
    if (token) {
      return <Dashboard />;
    }
    if (showRegister) {
      return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Asistente de Evaluaciones Anluis</h1>
        {renderContent()}
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
