import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function ClientsList(){
  const [q, setQ] = useState('');
  const [clients, setClients] = useState([]);

  const fetch = async () => {
    try {
      const res = await API.get('/clients', { params: { q, page:1, limit:50 } });
      setClients(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [q]);

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h1 style={{fontSize:20}}>Clients</h1>
        <Link to="/clients/new" className="btn">Add Client</Link>
      </div>

      <div style={{marginBottom:12}}>
        <input placeholder="Search name/phone" value={q} onChange={e => setQ(e.target.value)}
          style={{padding:8, width:'100%', boxSizing:'border-box'}} />
      </div>

      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Pending</th></tr></thead>
        <tbody>
          {clients.map(c => (
            <tr key={c._id}>
              <td><Link to={`/clients/${c._id}`}>{c.name}</Link></td>
              <td>{c.phone}</td>
              <td>{(c.pendingBalance||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
