import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Bu satır çok önemli

type Transaction = {
  direction: string;
  counterpartyName: string;
  counterpartyIban: string;
  amount: number;
  timestamp: string;
};

const TransactionHistoryPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"Tümü" | "Gelen" | "Giden">("Tümü");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5252/api/transactions/by-account/${accountId}`;
      if (startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(response.data);
    } catch (error) {
      alert("İşlem geçmişi alınamadı.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [accountId, startDate, endDate]);

  const filteredTransactions =
    filter === "Tümü"
      ? transactions
      : transactions.filter((t) => t.direction === filter);

      const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
      
        doc.text("Islem Gecmisi", 14, 16);
      
        const tableColumn = ["Tarih", "Yön", "Karsi Taraf", "IBAN", "Tutar"];
        const tableRows = filteredTransactions.map(tx => {
            
          const formattedAmount =
            (tx.direction === "Gelen" ? "+" : "-") + `${tx.amount} TL`;
      
          return [
            new Date(tx.timestamp).toLocaleString("tr-TR"),
            tx.direction,
            tx.counterpartyName.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""),
            tx.counterpartyIban,
            formattedAmount,
          ];
        });
      
        // @ts-ignore
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });
      
        doc.save("islem_gecmisi.pdf");
      };
      
      
      
      

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">İşlem Geçmişi</h2>

      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Başlangıç Tarihi</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bitiş Tarihi</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Filtre</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="Tümü">Tümü</option>
            <option value="Gelen">Gelen</option>
            <option value="Giden">Giden</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p>Seçilen filtreye ait işlem bulunamadı.</p>
      ) : (
        <ul className="space-y-6">
          {filteredTransactions.map((tx, i) => (
            <li key={i} className="border p-4 rounded">
              <p>
                <strong>
                  {tx.direction === "Gelen" ? "Gönderen" : "Alıcı"}:
                </strong>{" "}
                {tx.counterpartyName}
              </p>
              <p>
                <strong>IBAN:</strong> {tx.counterpartyIban}
              </p>
              <p>
                <strong>Miktar:</strong> {tx.amount} ₺
              </p>
              <p>
                <strong>Tarih:</strong>{" "}
                {new Date(tx.timestamp).toLocaleString("tr-TR")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          İşlem Geçmişini PDF Olarak İndir
        </button>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
