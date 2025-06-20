import React, { useEffect, useState } from "react";
import axios from "axios";

type LoanApplication = {
  id: number;
  user: { username: string };
  loanType: string;
  amount: number;
  termInMonths: number;
  applicationDate: string;
};

const AdminLoanApprovalsPage = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5252/api/admin/loans/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
    } catch (error) {
      alert("Başvurular alınamadı.");
    }
  };

  const handleAction = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5252/api/admin/loans/${id}/update-status`,
        { newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Başvuru ${newStatus.toLowerCase()} edildi.`);
      fetchApplications(); // güncelle
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bekleyen Kredi Başvuruları</h2>
      {applications.length === 0 ? (
        <p>Bekleyen başvuru yok.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="border p-4 rounded shadow">
              <p><strong>Kullanıcı:</strong> {app.user.username}</p>
              <p><strong>Kredi Türü:</strong> {app.loanType}</p>
              <p><strong>Tutar:</strong> {app.amount} TL</p>
              <p><strong>Vade:</strong> {app.termInMonths} ay</p>
              <p><strong>Başvuru Tarihi:</strong> {new Date(app.applicationDate).toLocaleString("tr-TR")}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleAction(app.id, "Approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Onayla
                </button>
                <button
                  onClick={() => handleAction(app.id, "Rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reddet
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminLoanApprovalsPage;
