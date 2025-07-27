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

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Asistente de Evaluaciones Anluis</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </main>
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
