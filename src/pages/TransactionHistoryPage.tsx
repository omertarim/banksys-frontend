import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("islem_gecmisi.pdf");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7fbfd",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 48
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
        padding: "3.5rem 4.5rem 3rem 4.5rem",
        maxWidth: 700,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>İşlem Geçmişi</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 32, justifyContent: "center" }}>
          <div>
            <label style={labelStyle}>Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Filtre</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={inputStyle}
            >
              <option value="Tümü">Tümü</option>
              <option value="Gelen">Gelen</option>
              <option value="Giden">Giden</option>
            </select>
          </div>
        </div>
        {filteredTransactions.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18, textAlign: "center", margin: "2rem 0" }}>Seçilen filtreye ait işlem bulunamadı.</div>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
            {filteredTransactions.map((tx, i) => (
              <li key={i} style={{
                border: "1.5px solid #e6f4fa",
                borderRadius: 14,
                background: "#f7fbfd",
                padding: "1.2rem 1.5rem",
                fontSize: 17,
                color: "#003366",
                boxShadow: "0 2px 8px rgba(0,97,168,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
                <div style={{ fontWeight: 700, color: tx.direction === "Gelen" ? "#16a34a" : "#ef4444", fontSize: 18, marginBottom: 2 }}>
                  {tx.direction === "Gelen" ? "Gelen" : "Giden"}
                </div>
                <div><strong>{tx.direction === "Gelen" ? "Gönderen" : "Alıcı"}:</strong> {tx.counterpartyName}</div>
                <div><strong>IBAN:</strong> {tx.counterpartyIban}</div>
                <div><strong>Miktar:</strong> {tx.amount} ₺</div>
                <div><strong>Tarih:</strong> {new Date(tx.timestamp).toLocaleString("tr-TR")}</div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={downloadPDF}
            style={buttonStyle}
          >
            İşlem Geçmişini PDF Olarak İndir
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#003366",
  fontSize: 15,
  marginBottom: 6,
  display: "block"
};

const buttonStyle: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.2rem",
  fontSize: 18,
  fontWeight: 700,
  marginTop: 8,
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
  transition: "background 0.2s"
};

export default TransactionHistoryPage;
