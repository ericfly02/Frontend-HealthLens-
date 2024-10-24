import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserDashboard from './pages/UserDashboard';
import ConsultationPage from './pages/ConsultationPage';
import AboutPage from './pages/AboutPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import { useNavigate } from 'react-router-dom';




function App() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const handleSwitchToSignup = () => {
    // Handle switch to signup logic if necessary
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute
            element={<UserDashboard />}
            loginComponent={<Login onClose={handleCloseLogin} onSwitchToSignup={handleSwitchToSignup} onLogin={handleLoginSuccess} />}
          />
          }
        />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
      </Routes>

      {showLogin && (
        <Login onClose={handleCloseLogin} onSwitchToSignup={handleSwitchToSignup} onLogin={() => setShowLogin(false)} />
      )}
    </Router>
  );
}

export default App;