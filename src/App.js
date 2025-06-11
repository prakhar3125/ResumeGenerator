import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResumeGenerator from './Resume';

import LandingPage from './LandingPage';
import { DarkModeProvider } from './Resume'; // Import DarkModeProvider from Resume.js

const App = () => {
  return (
    <DarkModeProvider>
      <Router>
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
          <Routes>
            {/* Default route - LandingPage */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Resume builder route */}
            <Route path="/builder" element={<ResumeGenerator />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
