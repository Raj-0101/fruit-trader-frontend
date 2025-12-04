import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Reports(){
  const [farmers, setFarmers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(()=> {
    API.get('/reports/farmers-pending').then(r=>setFarmers(r.data)).catch(()=>{});
    API.get('/reports/clients-pending').then(r=>setClients(r.data)).catch(()=>{});
  },[]);

  return (
    <div>
      <h1 style={{fontSize:22}}>Reports - Pending</h1>
      <h3>Farmers</h3>
      <table style={{marginBottom:12}}>
        <thead><tr><th>Name</th><th>Code</th><th>Village</th><th>Pending</th></tr></thead>
        <tbody>
          {farmers.map(f => (
            <tr key={f._id}>
              <td>{f.name}</td><td>{f.farmerCode}</td><td>{f.village}</td><td>{(f.pendingBalance||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Clients</h3>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Pending</th></tr></thead>
        <tbody>
          {clients.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.phone}</td><td>{(c.pendingBalance||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
