import { jsPDF } from "jspdf";
import "jspdf-autotable";      // just import it so it registers .autoTable on jsPDF
import * as XLSX from "xlsx";  // namespace import (works with Vite)
import { saveAs } from "file-saver";



export default function Purchases() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await purchasesService.getAll();
    setItems(res);
  };

  // EXPORT EXCEL
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    const file = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([file]), "purchases.xlsx");
  };

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Purchases Report", 10, 10);
    doc.autoTable({
      head: [Object.keys(items[0] || {})],
      body: items.map((i) => Object.values(i)),
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
            <tr key={i._id}>
              {Object.values(i).map((v, idx) => (
                <td key={idx}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
