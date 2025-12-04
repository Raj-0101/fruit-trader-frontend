// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import Clients from "./pages/Clients";
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
            <h1>Rafulin Orchards</h1>
            <div style={{fontSize:14,color:'#6b7280'}}>Manage farmers, clients and reports</div>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/farmers" element={<Farmers/>}/>
            <Route path="/clients" element={<Clients/>}/>
            <Route path="/purchases" element={<Purchases/>}/>
            <Route path="/sales" element={<Sales/>}/>
            <Route path="/reports" element={<Reports/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
