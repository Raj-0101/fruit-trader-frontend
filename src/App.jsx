import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FarmersList from './pages/FarmersList';
import FarmerForm from './pages/FarmerForm';
import FarmerDetail from './pages/FarmerDetail';
import ClientsList from './pages/ClientsList';
import ClientForm from './pages/ClientForm';
import ClientDetail from './pages/ClientDetail';
import Reports from './pages/Reports';

export default function App() {
  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar />
      <main style={{flex:1, padding:20, background:'#f3f4f6'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmers" element={<FarmersList />} />
          <Route path="/farmers/new" element={<FarmerForm />} />
          <Route path="/farmers/:id" element={<FarmerDetail />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}
