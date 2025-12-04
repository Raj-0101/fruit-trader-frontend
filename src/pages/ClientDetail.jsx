import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';

export default function ClientDetail(){
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({});

  const fetch = async () => {
    try {
      const res = await API.get(`/clients/${id}`);
      setClient(res.data.client);
      setSales(res.data.sales || []);
      setSummary(res.data.summary || {});
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [id]);

  return (
    <div>
      <h1 style={{fontSize:22}}>{client?.name || 'Client'}</h1>
      <div style={{marginBottom:12}}>Phone: {client?.phone} | Pending: {(client?.pendingBalance||0).toFixed(2)}</div>

      <div style={{marginBottom:12}}>
        <strong>Summary:</strong>
        <div>Total Kg: {summary.totalKg}</div>
        <div>Total Value: {summary.totalAmount}</div>
        <div>Total Received: {summary.totalPaid}</div>
        <div>Total Pending: {summary.totalPending}</div>
      </div>

      <table>
        <thead><tr><th>Date</th><th>Fruit</th><th>Kg</th><th>Rate</th><th>Total</th><th>Paid</th><th>Pending</th></tr></thead>
        <tbody>
          {sales.map(s => (
            <tr key={s._id}>
              <td>{new Date(s.date).toLocaleDateString()}</td>
              <td>{s.fruit}</td>
              <td>{s.quantityKg}</td>
              <td>{s.ratePerKg}</td>
              <td>{s.totalAmount}</td>
              <td>{s.paidAmount}</td>
              <td>{s.pendingAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
