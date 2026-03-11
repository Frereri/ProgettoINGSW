import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AgenteDashboard from './pages/AgenteDashboard';
import ImmobileDettaglio from './pages/ImmobileDettaglio';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import GestoreDashboard from './pages/GestoreDashboard';
import ClienteDashboard from './pages/ClienteDashboard';
import StoricoOffertaDettaglio from './components/agenteDashboard/StoricoOffertaDettaglio';
import OfferteTabellaAgente from './components/agenteDashboard/OfferteTabellaAgente';
import SignUp from './pages/SignUp';
import ChangePasswordForm from './components/ChangePasswordForm';
import { PropertyForm } from './components/PropertyForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/immobile/:id" element={<ImmobileDettaglio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/agente" element={<AgenteDashboard />} />
        <Route path="/cambio-password" element={<ChangePasswordForm />} />
        <Route path="/nuovo-immobile" element={<PropertyForm />} />
        <Route path="/amministratore" element={<AdminDashboard />} />
        <Route path="/supporto" element={<AdminDashboard />} />
        <Route path="/gestore" element={<GestoreDashboard />} />
        <Route path="/cliente" element={<ClienteDashboard />} />        
        <Route path="/gestione-offerte" element={<OfferteTabellaAgente modo="gestione" />} />       
        <Route path="/storico/:idOfferta" element={<StoricoOffertaDettaglio />} />
        <Route path="/storico" element={<OfferteTabellaAgente modo="storico" />} />
      </Routes>
    </Router>
  );
}

export default App;