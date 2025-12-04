// src/pages/Farmers.jsx
import React, {useState,useEffect} from "react";
import axios from "axios";
import FarmerForm from "../components/FarmerForm";

const API = import.meta.env.VITE_API_URL || "";

export default function Farmers(){
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(()=> { fetchList(); }, []);

  async function fetchList(){
    setLoading(true);
    try{
      const res = await axios.get(`${API}/farmers?page=1&limit=200`);
      setFarmers(res.data || []);
    }catch(e){ console.error(e); alert("Failed to load farmers"); }
    setLoading(false);
  }

  async function remove(id){
    if(!confirm("Delete this farmer?")) return;
    try{
      await axios.delete(`${API}/farmers/${id}`);
      fetchList();
    }catch(e){ console.error(e); alert("Delete failed"); }
  }

  function openEdit(f){
    setEditing(f);
    setShowForm(true);
  }
  function openAdd(){
    setEditing(null);
    setShowForm(true);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2>Farmers</h2>
        <button className="btn btn-accent" onClick={openAdd}>Add Farmer</button>
      </div>

      <div className="card">
        {loading ? <div>Loading...</div> :
          <table className="table">
            <thead><tr><th>Name</th><th>Phone</th><th>Village</th><th>Pending</th><th>Actions</th></tr></thead>
            <tbody>
              {farmers.map(f=>(
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.phone}</td>
                  <td>{f.village}</td>
                  <td>{f.pending ?? 0}</td>
                  <td className="actions">
                    <button className="btn" onClick={()=>openEdit(f)}>Edit</button>
                    <button className="btn btn-danger" onClick={()=>remove(f._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      {showForm && <FarmerForm
         farmer={editing}
         onClose={()=>{ setShowForm(false); fetchList(); }}
      />}
    </div>
  );
}
