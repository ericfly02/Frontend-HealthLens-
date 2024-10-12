import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserDashboard from './pages/UserDashboard';
import ConsultationPage from './pages/ConsultationPage';
import AboutPage from './pages/AboutPage';
import EncyclopediaPage from './pages/EncyclopediaPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
      </Routes>
    </Router>
  );
}

export default App;