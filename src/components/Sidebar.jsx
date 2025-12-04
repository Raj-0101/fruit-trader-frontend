import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar(){
  return (
    <aside style={{width:220, background:'#fff', borderRight:'1px solid #e5e7eb', padding:16}}>
      <h2 style={{fontSize:18, fontWeight:700, marginBottom:12}}>Fruit Trader</h2>
      <nav style={{display:'flex', flexDirection:'column', gap:8}}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/farmers">Farmers</NavLink>
        <NavLink to="/clients">Clients</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>
    </aside>
  );
}
