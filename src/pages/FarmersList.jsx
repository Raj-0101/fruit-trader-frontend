import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function FarmersList(){
  const [q, setQ] = useState('');
  const [farmers, setFarmers] = useState([]);

  const fetch = async () => {
    try {
      const res = await API.get('/farmers', { params: { q, page:1, limit:50 } });
      setFarmers(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [q]);

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h1 style={{fontSize:20}}>Farmers</h1>
        <Link to="/farmers/new" className="btn">Add Farmer</Link>
      </div>

      <div style={{marginBottom:12}}>
        <input placeholder="Search name/phone/village/code" value={q} onChange={e => setQ(e.target.value)}
          style={{padding:8, width:'100%', boxSizing:'border-box'}} />
      </div>

      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Village</th><th>Code</th><th>Pending</th></tr></thead>
        <tbody>
          {farmers.map(f => (
            <tr key={f._id}>
              <td><Link to={`/farmers/${f._id}`}>{f.name}</Link></td>
              <td>{f.phone}</td>
              <td>{f.village}</td>
              <td>{f.farmerCode}</td>
              <td>{(f.pendingBalance||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
