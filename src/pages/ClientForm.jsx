import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function ClientForm(){
  const [form, setForm] = useState({ name:'', phone:'', address:'', gstNumber:'', notes:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone){ setError('Name and phone are required'); return; }
    try {
      await API.post('/clients', form);
      nav('/clients');
    } catch (err) { setError(err?.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <h1 style={{fontSize:20}}>Add Client</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit} style={{maxWidth:480, marginTop:12}}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input value={form.gstNumber} onChange={e=>setForm({...form,gstNumber:e.target.value})} placeholder="GST/Tax number" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <div><button className="btn">Save</button></div>
      </form>
    </div>
  );
}
