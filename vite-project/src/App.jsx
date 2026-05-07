// frontend/src/App.jsx - Remove HelmetProvider
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuditPage from './pages/AuditPage';
import ResultsPage from './pages/ResultsPage';
import PublicAuditPage from './pages/PublicAuditPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/audit/:shareableId" element={<PublicAuditPage />} />
      </Routes>
    </Router>
  );
}

export default App;