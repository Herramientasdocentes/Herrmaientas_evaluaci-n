import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import useStore from './store';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import DashboardLayout from './components/DashboardLayout'; // Importar el nuevo layout

// Componente para manejar las vistas de autenticación
function AuthPage() {
  const [showRegister, setShowRegister] = React.useState(false);
  if (showRegister) {
    return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
  }
  return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
}

// Componentes placeholder para las nuevas rutas
const QuestionsPage = () => <div>Página de Banco de Preguntas</div>;
const AssessmentsPage = () => <div>Página de Mis Evaluaciones</div>;

function App() {
  const token = useStore((state) => state.token);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={token ? <Navigate to="/dashboard" /> : <AuthPage />} />
              <Route
                path="/dashboard"
                element={token ? <DashboardLayout><Dashboard /></DashboardLayout> : <Navigate to="/" />}
              />
              <Route
                path="/questions"
                element={token ? <DashboardLayout><QuestionsPage /></DashboardLayout> : <Navigate to="/" />}
              />
              <Route
                path="/assessments"
                element={token ? <DashboardLayout><AssessmentsPage /></DashboardLayout> : <Navigate to="/" />}
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
