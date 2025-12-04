import React, { useEffect, useState } from "react";
import salesService from "../services/salesService";
import { saveAs } from "file-saver";
import XLSX from "xlsx";
import jsPDF from "jspdf";

export default function Sales() {
  const empty = { date: "", fruit: "", quantity: 0, rate: 0, paid: 0, notes: "" };
  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await salesService.getAll();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e); alert("Failed to load sales");
    }
    setLoading(false);
  }

  function computeTotals(f) {
    const q = Number(f.quantity || 0);
    const r = Number(f.rate || 0);
    const total = q * r;
    const paid = Number(f.paid || 0);
    const pending = total - paid;
    return { total, pending };
  }

  async function save(e) {
    e.preventDefault();
    try {
      const { total, pending } = computeTotals(form);
      const payload = { ...form, quantity: Number(form.quantity), rate: Number(form.rate), total, paid: Number(form.paid || 0), pending };
      if (editingId) {
        await salesService.update(editingId, payload);
        setEditingId(null);
      } else {
        await salesService.create(payload);
      }
      setForm(empty);
      load();
    } catch (err) {
      console.error(err); alert("Save failed");
    }
  }

  function startEdit(item) {
    setEditingId(item._id || item.id);
    setForm({
      date: item.date ? item.date.split("T")[0] : item.date || "",
      fruit: item.fruit || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      paid: item.paid || 0,
      notes: item.notes || "",
    });
  }

  async function remove(id) {
    if (!confirm("Delete this record?")) return;
    try { await salesService.remove(id); load(); }
    catch (e) { console.error(e); alert("Delete failed"); }
  }

  // Exports
  function exportCSV() {
    if (!list.length) return alert("No data");
    const rows = list.map(r => ({
      Date: r.date ? r.date.split("T")[0] : r.date,
      Fruit: r.fruit,
      Quantity: r.quantity,
      Rate: r.rate,
      Total: r.total,
      Paid: r.paid,
      Pending: r.pending
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales.csv");
  }

  function exportExcel() {
    if (!list.length) return alert("No data");
    const ws = XLSX.utils.json_to_sheet(list.map(r => ({
      Date: r.date ? r.date.split("T")[0] : r.date,
      Fruit: r.fruit,
      Quantity: r.quantity,
      Rate: r.rate,
      Total: r.total,
      Paid: r.paid,
      Pending: r.pending
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sales.xlsx");
  }

  function exportPDF() {
    if (!list.length) return alert("No data");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Sales Report", 14, 18);
    doc.setFontSize(10);
    let y = 26;
    doc.text("Date | Fruit | Qty | Rate | Total | Paid | Pending", 14, y);
    y += 6;
    list.forEach(r => {
      const line = `${r.date ? r.date.split("T")[0] : r.date} | ${r.fruit} | ${r.quantity} | ${r.rate} | ${r.total} | ${r.paid} | ${r.pending}`;
      doc.text(line, 14, y);
      y += 6;
      if (y > 275) { doc.addPage(); y = 20; }
    });
    doc.save("sales.pdf");
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2>Sales</h2>
        <div>
          <button className="btn" onClick={exportCSV} style={{marginRight:8}}>Export CSV</button>
          <button className="btn" onClick={exportExcel} style={{marginRight:8}}>Export Excel</button>
          <button className="btn btn-accent" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <form onSubmit={save}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
            <input placeholder="Fruit" value={form.fruit} onChange={e=>setForm({...form,fruit:e.target.value})} required />
            <input type="number" placeholder="Quantity (kg)" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required />
            <input type="number" placeholder="Rate per kg" value={form.rate} onChange={e=>setForm({...form,rate:e.target.value})} required />
            <input type="number" placeholder="Paid amount" value={form.paid} onChange={e=>setForm({...form,paid:e.target.value})} />
            <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          </div>

          <div style={{marginTop:10}}>
            <button className="btn btn-primary" type="submit">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" className="btn" onClick={()=>{ setEditingId(null); setForm(empty); }} style={{marginLeft:8}}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Records</h3>
        {loading ? <div>Loading...</div> :
          <table className="table">
            <thead><tr><th>Date</th><th>Fruit</th><th>Qty</th><th>Rate</th><th>Total</th><th>Paid</th><th>Pending</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map(item => (
                <tr key={item._id || item.id}>
                  <td>{item.date ? item.date.split("T")[0] : item.date}</td>
                  <td>{item.fruit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.rate}</td>
                  <td>{item.total}</td>
                  <td>{item.paid}</td>
                  <td>{item.pending}</td>
                  <td className="actions">
                    <button className="btn" onClick={()=>startEdit(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={()=>remove(item._id || item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
