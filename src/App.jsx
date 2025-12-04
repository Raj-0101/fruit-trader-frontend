// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import FarmersList from "./pages/FarmersList";
import ClientsList from "./pages/ClientsList";
import Reports from "./pages/Reports";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";

export default function App(){
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main">
          <div className="header">
            <h1 style={{color: "#001f4d"}}>Rafulin Orchards</h1>
            <div style={{fontSize:14,color:'#6b7280'}}>Manage farmers, clients and reports</div>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/farmers" element={<FarmersList/>}/>
            <Route path="/clients" element={<ClientsList/>}/>
            <Route path="/purchases" element={<Purchases/>}/>
            <Route path="/sales" element={<Sales/>}/>
            <Route path="/reports" element={<Reports/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
