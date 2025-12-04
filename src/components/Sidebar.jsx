// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar(){
  return (
    <div className="sidebar">
      <div className="brand">
        <img src="/logo.png" alt="Rafulin logo" />
        <div>
          <div className="title">Rafulin Orchards</div>
          <div style={{fontSize:12,color:'#6b7280'}}>Fruit trading app</div>
        </div>
      </div>

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/farmers">Farmers</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/purchases">Purchases</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/reports">Reports</Link>
      </nav>
    </div>
  );
}
