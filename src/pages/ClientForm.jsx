// src/components/ClientForm.jsx
import React, {useState, useEffect} from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "";

export default function ClientForm({client, onClose}){
  const [form, setForm] = useState({name:"",phone:"",gst:"",notes:""});
  useEffect(()=>{ if(client) setForm(client); },[client]);

  async function save(e){
    e.preventDefault();
    try{
      if(form._id){
        await axios.put(`${API}/clients/${form._id}`, form);
      } else {
        await axios.post(`${API}/clients`, form);
      }
      onClose();
    }catch(err){ console.error(err); alert("Save failed"); }
  }

  return (
    <div style={{
      position:"fixed",left:0,top:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,0.4)"
    }}>
      <form className="card" style={{width:520}} onSubmit={save}>
        <h3>{form._id ? "Edit Client" : "Add Client"}</h3>

        <div className="form-row"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" required/></div>
        <div className="form-row"><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" required/></div>
        <div className="form-row"><input value={form.gst} onChange={e=>setForm({...form,gst:e.target.value})} placeholder="GST / Tax no"/></div>
        <div className="form-row"><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes"></textarea></div>

        <div style={{display:"flex",gap:8}}>
          <button type="submit" className="btn btn-primary">{form._id ? "Update" : "Save"}</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
