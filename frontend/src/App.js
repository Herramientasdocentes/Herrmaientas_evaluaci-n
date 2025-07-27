import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import useStore from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';


function App() {
  const token = useStore((state) => state.token);

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="App-header">
          <h1>Asistente de Evaluaciones Anluis</h1>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </main>

        {/* ▼▼▼ NUEVO FOOTER ▼▼▼ */}
        <footer style={{ padding: '20px', backgroundColor: '#f8f9fa', marginTop: 'auto', textAlign: 'center', fontSize: '0.9em', color: '#6c757d' }}>
          <p>&copy; 2025 Herramientas Docentes Anluis. Todos los derechos reservados.</p>
        </footer>
        {/* ▲▲▲ FIN DEL FOOTER ▲▲▲ */}

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

function AuthPage() {
  const [showRegister, setShowRegister] = React.useState(false);
  if (showRegister) {
    return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
  }
  return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
}

export default App;
