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
    <div style={{
      background: "#fff",
      borderRadius: 24,
      boxShadow: "0 4px 24px rgba(0,97,168,0.10)",
      padding: "2.5rem 3.5rem 2rem 3.5rem",
      maxWidth: 900,
      width: "95vw",
      margin: "2.5rem auto 0 auto"
    }}>
      <h2 style={{ color: "#009ee3", fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: "center" }}>Kredi Başvuru Geçmişim</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 18 }}>
          <thead>
            <tr style={{ background: "#f7fbfd" }}>
              <th style={thStyle}>Tarih</th>
              <th style={thStyle}>Kredi Türü</th>
              <th style={thStyle}>Tutar</th>
              <th style={thStyle}>Vade (ay)</th>
              <th style={thStyle}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} style={{ background: "#fff", borderBottom: "1px solid #e6f4fa" }}>
                <td style={tdStyle}>{new Date(app.createdAt).toLocaleString()}</td>
                <td style={tdStyle}>{app.creditType}</td>
                <td style={tdStyle}>{app.amount} TL</td>
                <td style={tdStyle}>{app.termInMonths}</td>
                <td style={{ ...tdStyle, color: app.status === "Onaylandı" ? "#22c55e" : app.status === "Reddedildi" ? "#ef4444" : "#0061a8", fontWeight: 700 }}>{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "1rem 1.2rem",
  color: "#003366",
  fontWeight: 700,
  fontSize: 18,
  textAlign: "left",
  borderBottom: "2px solid #e6f4fa"
};
const tdStyle: React.CSSProperties = {
  padding: "0.9rem 1.2rem",
  color: "#003366",
  fontWeight: 500,
  fontSize: 18,
  textAlign: "left"
};

export default MyLoanApplicationsPage;
