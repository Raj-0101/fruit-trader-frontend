// src/pages/Sales.jsx
import React, { useState, useEffect } from "react";
import salesService from "../services/salesService.js";    // match folder name exactly
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    } catch (err) {
      console.error(err);
      alert("Failed to load sales");
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
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        total,
        paid: Number(form.paid || 0),
        pending
      };

      if (editingId) {
        await salesService.update(editingId, payload);
        setEditingId(null);
      } else {
        await salesService.create(payload);
      }

      setForm(empty);
      load();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  function startEdit(item) {
    setEditingId(item._id || item.id);
    setForm({
      date: item.date ? item.date.split("T")[0] : "",
      fruit: item.fruit || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      paid: item.paid || 0,
      notes: item.notes || "",
    });
  }

  async function remove(id) {
    if (!confirm("Delete this record?")) return;
    try {
      await salesService.remove(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  // EXPORTS -----------------------------

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

    const csv =
      Object.keys(rows[0]).join(",") + "\n" +
      rows.map(r => Object.values(r).join(",")).join("\n");

    saveAs(new Blob([csv], { type: "text/csv" }), "sales.csv");
  }

  function exportExcel() {
    if (!list.length) return alert("No data");

    const data = list.map(r => ({
      Date: r.date ? r.date.split("T")[0] : r.date,
      Fruit: r.fruit,
      Quantity: r.quantity,
      Rate: r.rate,
      Total: r.total,
      Paid: r.paid,
      Pending: r.pending
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");

    const excel = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excel]), "sales.xlsx");
  }

  function exportPDF() {
    if (!list.length) return alert("No data");

    const doc = new jsPDF();
    doc.text("Sales Report", 12, 10);

    const tableData = list.map(r => [
      r.date ? r.date.split("T")[0] : "",
      r.fruit,
      r.quantity,
      r.rate,
      r.total,
      r.paid,
      r.pending
    ]);

    doc.autoTable({
      head: [["Date", "Fruit", "Qty", "Rate", "Total", "Paid", "Pending"]],
      body: tableData,
      startY: 16
    });

    doc.save("sales.pdf");
  }

  return (
    <div>
      <h2>Sales</h2>

      <div style={{ marginBottom: 10 }}>
        <button className="btn" onClick={exportCSV}>CSV</button>
        <button className="btn" onClick={exportExcel} style={{ marginLeft: 6 }}>Excel</button>
        <button className="btn btn-accent" onClick={exportPDF} style={{ marginLeft: 6 }}>PDF</button>
      </div>

      {/* FORM */}
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={save}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <input placeholder="Fruit" value={form.fruit} onChange={e => setForm({ ...form, fruit: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <input type="number" placeholder="Rate" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} required />
            <input type="number" placeholder="Paid" value={form.paid} onChange={e => setForm({ ...form, paid: e.target.value })} />
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: 10 }}>
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button className="btn" type="button" onClick={() => { setEditingId(null); setForm(empty); }} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>Records</h3>

        {loading ? <div>Loading...</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Fruit</th><th>Qty</th><th>Rate</th><th>Total</th><th>Paid</th><th>Pending</th><th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map(item => (
                <tr key={item._id}>
                  <td>{item.date ? item.date.split("T")[0] : ""}</td>
                  <td>{item.fruit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.rate}</td>
                  <td>{item.total}</td>
                  <td>{item.paid}</td>
                  <td>{item.pending}</td>
                  <td>
                    <button className="btn" onClick={() => startEdit(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => remove(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}
