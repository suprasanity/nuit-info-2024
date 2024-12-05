import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { InteractiveModelPage } from './pages/InteractiveModelPage';
import { MediaPage } from './pages/MediaPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modele-interactif" element={<InteractiveModelPage />} />
        <Route path="/media" element={<MediaPage />} />
      </Routes>
    </div>
  );
}

export default App;