// src/pages/Clients.jsx
import React, {useState,useEffect} from "react";
import axios from "axios";
import ClientForm from "../components/ClientForm";

const API = import.meta.env.VITE_API_URL || "";

export default function Clients(){
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(()=> { fetchList(); }, []);

  async function fetchList(){
    setLoading(true);
    try{
      const res = await axios.get(`${API}/clients?page=1&limit=200`);
      setClients(res.data || []);
    }catch(e){ console.error(e); alert("Failed to load clients"); }
    setLoading(false);
  }

  async function remove(id){
    if(!confirm("Delete this client?")) return;
    try{
      await axios.delete(`${API}/clients/${id}`);
      fetchList();
    }catch(e){ console.error(e); alert("Delete failed"); }
  }

  function openEdit(c){
    setEditing(c);
    setShowForm(true);
  }
  function openAdd(){
    setEditing(null);
    setShowForm(true);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2>Clients</h2>
        <button className="btn btn-accent" onClick={openAdd}>Add Client</button>
      </div>

      <div className="card">
        {loading ? <div>Loading...</div> :
          <table className="table">
            <thead><tr><th>Name</th><th>Phone</th><th>GST</th><th>Pending</th><th>Actions</th></tr></thead>
            <tbody>
              {clients.map(c=>(
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.gst || "-"}</td>
                  <td>{c.pending ?? 0}</td>
                  <td className="actions">
                    <button className="btn" onClick={()=>openEdit(c)}>Edit</button>
                    <button className="btn btn-danger" onClick={()=>remove(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      {showForm && <ClientForm
         client={editing}
         onClose={()=>{ setShowForm(false); fetchList(); }}
      />}
    </div>
  );
}
