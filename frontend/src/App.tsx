import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserDashboard from './pages/UserDashboard';
import ConsultationPage from './pages/ConsultationPage';
import AboutPage from './pages/AboutPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => {
    setShowLogin(false);
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
              loginComponent={<Login onClose={handleCloseLogin} onSwitchToSignup={handleSwitchToSignup} onLogin={() => setShowLogin(false)} />} />} 
            />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>

      {showLogin && (
        <Login onClose={handleCloseLogin} onSwitchToSignup={handleSwitchToSignup} onLogin={() => setShowLogin(false)} />
      )}
    </Router>
  );
}

export default App;