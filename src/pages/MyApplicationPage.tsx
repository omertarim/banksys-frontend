// src/pages/MyLoanApplicationsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LoanApplication {
  id: number;
  creditType: string;
  amount: number;
  termInMonths: number;
  status: string;
  createdAt: string;
}

const MyLoanApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5252/api/participation/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setApplications(res.data))
    .catch((err) => console.error("Kredi başvuruları alınamadı:", err));
  }, []);

  return (
    <div>
      <h2>Kredi Başvuru Geçmişi</h2>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kredi Türü</th>
            <th>Tutar</th>
            <th>Vade (ay)</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{new Date(app.createdAt).toLocaleString()}</td>
              <td>{app.creditType}</td>
              <td>{app.amount} TL</td>
              <td>{app.termInMonths}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyLoanApplicationsPage;
