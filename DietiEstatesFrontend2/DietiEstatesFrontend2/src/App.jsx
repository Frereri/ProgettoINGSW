import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AgenteDashboard from './pages/AgenteDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GestoreDashboard from './pages/GestoreDashboard';
import ClienteDashboard from './pages/ClienteDashboard';
import DettagliImmobile from './pages/DettagliImmobile';

import ImmobileForm from './components/ImmobileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import OfferteTabellaAgente from './components/agente/OfferteTabellaAgente';
import StoricoOffertaDettaglio from './components/agente/StoricoOffertaDettaglio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. ROTTE PUBBLICHE */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/immobile/:id" element={<DettagliImmobile />} />

          {/* 2. ROTTE PRIVATE: Solo se loggati */}
          <Route element={<ProtectedRoute />}>
             <Route path="/cambio-password" element={<ChangePasswordForm />} />
          </Route>

          {/* 3. ROTTE CLIENTE */}
          <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
            <Route path="/cliente" element={<ClienteDashboard />} />
          </Route>

          {/* 4. ROTTE AGENTE */}
          <Route element={<ProtectedRoute allowedRoles={['Agente']} />}>
            <Route path="/agente" element={<AgenteDashboard />} />
            <Route path="/nuovo-immobile" element={<ImmobileForm />} />
            <Route path="/gestione-offerte" element={<OfferteTabellaAgente modo="gestione" />} />
            <Route path="/storico" element={<OfferteTabellaAgente modo="storico" />} />
            <Route path="/storico/:idOfferta" element={<StoricoOffertaDettaglio />} />
          </Route>

          {/* 5. ROTTE ADMIN E GESTORE */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Gestore', 'Supporto', 'SUPPORTO_AMMINISTRATORE']} />}>
            <Route path="/amministratore" element={<AdminDashboard />} />
            <Route path="/supporto" element={<AdminDashboard />} />
            <Route path="/gestore" element={<GestoreDashboard />} />
          </Route>

          {/* Pagina 404 */}
          <Route path="*" element={<div>Pagina non trovata</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;