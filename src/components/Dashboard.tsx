import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

type Account = {
  id: number;
  accountNumber: string;
  iban: string;
  balance: number;
  accountType: string;
  currency: string;
};

const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-customer");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5252/api/account/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data);
      } catch (error) {
        alert("Hesaplar alınamadı.");
      }
    };

    fetchAccounts();
  }, [navigate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Hesaplarım", 14, 16);
    const tableColumn = ["Hesap No", "IBAN", "Tür", "Bakiye"];
    const tableRows = accounts.map(acc => [
      acc.accountNumber,
      acc.iban,
      acc.accountType,
      `${acc.balance} ${acc.currency}`,
    ]);

    // @ts-ignore
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("hesaplarim.pdf");
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Hesaplarım</h2>

      {accounts.length > 0 ? (
        <ul className="space-y-4">
          {accounts.map(account => (
            <li key={account.id} className="border p-4 rounded">
              <p><strong>IBAN:</strong> {account.iban}</p>
              <p><strong>Hesap No:</strong> {account.accountNumber}</p>
              <p><strong>Tür:</strong> {account.accountType}</p>
              <p><strong>Bakiye:</strong> {account.balance} {account.currency}</p>

              <button
                onClick={() => navigate(`/transactions/${account.id}`)}
                className="mt-2 bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
              >
                İşlem Geçmişi
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Hesap bulunamadı.</p>
      )}

      <button onClick={() => navigate("/participation-loan")} className="bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-green-700">
        Katılım Kredisi Hesapla
      </button>

      <button onClick={() => navigate("/loan-apply")} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
        Kredi Başvurusu Yap
      </button>

      <button onClick={() => navigate("/create-account")} className="bg-purple-600 text-white px-4 py-2 mt-2 rounded hover:bg-purple-700">
        Yeni Hesap Oluştur
      </button>

      <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
        Hesapları PDF Olarak İndir
      </button>

      <button onClick={() => navigate('/update-customer-info')} className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
        Bilgilerimi Güncelle
      </button>
    </div>
  );
};

export default Dashboard;
