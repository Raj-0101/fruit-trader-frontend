// src/pages/Purchases.jsx
import React, { useState, useEffect } from "react";
import purchasesService from "../services/purchasesService"; // match folder case
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Purchases() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await purchasesService.getAll();
      setItems(res || []);
    } catch (err) {
      console.error("Load purchases error:", err);
      setItems([]);
    }
  };

  // EXPORT EXCEL
  const exportExcel = () => {
    if (!items || items.length === 0) return alert("No data to export");
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    const file = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([file], { type: "application/octet-stream" }), "purchases.xlsx");
  };

  // EXPORT PDF
  const exportPDF = () => {
    if (!items || items.length === 0) return alert("No data to export");
    const doc = new jsPDF();
    doc.text("Purchases Report", 10, 10);

    const keys = Object.keys(items[0] || {});
    const body = items.map((i) => keys.map((k) => (i[k] === undefined ? "" : String(i[k]))));

    doc.autoTable({
      head: [keys],
      body,
      startY: 18,
      styles: { fontSize: 8 },
    });

    doc.save("purchases.pdf");
  };

  return (
    <div>
      <h2>Purchases</h2>

      <button onClick={exportExcel} className="btn">Export Excel</button>
      <button onClick={exportPDF} className="btn" style={{ marginLeft: 10 }}>
        Export PDF
      </button>

      <table>
        <thead>
          <tr>
            {Object.keys(items[0] || {}).map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i._id || JSON.stringify(i)}>
              {Object.keys(items[0] || {}).map((k) => (
                <td key={k}>{String(i[k] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
