import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';

export default function FarmerDetail(){
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState({});

  const fetch = async () => {
    try {
      const res = await API.get(`/farmers/${id}`);
      setFarmer(res.data.farmer);
      setPurchases(res.data.purchases || []);
      setSummary(res.data.summary || {});
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [id]);

  return (
    <div>
      <h1 style={{fontSize:22}}>{farmer?.name || 'Farmer'}</h1>
      <div style={{marginBottom:12}}>Code: {farmer?.farmerCode} | Phone: {farmer?.phone} | Pending: {(farmer?.pendingBalance||0).toFixed(2)}</div>

      <div style={{marginBottom:12}}>
        <strong>Summary:</strong>
        <div>Total Kg: {summary.totalKg}</div>
        <div>Total Value: {summary.totalAmount}</div>
        <div>Total Paid: {summary.totalPaid}</div>
        <div>Total Pending: {summary.totalPending}</div>
      </div>

      <table>
        <thead><tr><th>Date</th><th>Fruit</th><th>Kg</th><th>Rate</th><th>Total</th><th>Paid</th><th>Pending</th></tr></thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p._id}>
              <td>{new Date(p.date).toLocaleDateString()}</td>
              <td>{p.fruit}</td>
              <td>{p.quantityKg}</td>
              <td>{p.ratePerKg}</td>
              <td>{p.totalAmount}</td>
              <td>{p.paidAmount}</td>
              <td>{p.pendingAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
