// src/pages/Reports.jsx
import React, {useEffect,useState} from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
const API = import.meta.env.VITE_API_URL || "";

export default function Reports(){
  const [rows,setRows] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const res = await axios.get(`${API}/reports/pending/farmers`);
      setRows(res.data || []);
    }catch(err){ console.error(err); alert("Failed to load reports"); }
  }

  function exportCSV(){
    if(!rows.length) return alert("No data");
    const header = ["Farmer","Pending"];
    const csv = [
      header.join(","),
      ...rows.map(r => `"${r.name}",${r.pending}`)
    ].join("\n");
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    saveAs(blob, "pending_farmers.csv");
  }

  function exportPDF(){
    if(!rows.length) return alert("No data");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Pending from Farmers", 14, 20);
    let y = 30;
    doc.setFontSize(11);
    rows.forEach((r,i)=>{
      doc.text(`${i+1}. ${r.name}  ${r.pending}`, 14, y);
      y += 6;
    });
    doc.save("pending_farmers.pdf");
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2>Reports</h2>
        <div>
          <button className="btn btn-primary" onClick={exportCSV} style={{marginRight:8}}>Export CSV</button>
          <button className="btn btn-accent" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Farmer</th><th>Pending</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r._id}><td>{r.name}</td><td>{r.pending}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
