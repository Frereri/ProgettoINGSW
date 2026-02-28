import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ImmobileDettaglio from './pages/ImmobileDettaglio';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/immobile/:id" element={<ImmobileDettaglio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;