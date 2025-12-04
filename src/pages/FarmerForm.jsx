import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function FarmerForm(){
  const [form, setForm] = useState({ name:'', phone:'', address:'', village:'', farmerCode:'', notes:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.farmerCode){ setError('Name, phone, code are required'); return; }
    try {
      await API.post('/farmers', form);
      nav('/farmers');
    } catch (err) { setError(err?.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <h1 style={{fontSize:20}}>Add Farmer</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit} style={{maxWidth:480, marginTop:12}}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input value={form.farmerCode} onChange={e=>setForm({...form,farmerCode:e.target.value})} placeholder="Farmer Code" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <input value={form.village} onChange={e=>setForm({...form,village:e.target.value})} placeholder="Village" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" style={{display:'block', width:'100%', padding:8, marginBottom:8}} />
        <div><button className="btn">Save</button></div>
      </form>
    </div>
  );
}
