import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Account = {
  id: number;
  accountNumber: string;
  iban: string;
  balance: number;
  accountType: string;
  currency: string;
};

const Dashboard = forwardRef((props, ref) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

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

  useImperativeHandle(ref, () => ({
    refreshAccounts: fetchAccounts
  }));

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
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
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("hesaplarim.pdf");
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 32,
      boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
      padding: "3rem 4.5rem 2.5rem 4.5rem",
      maxWidth: 1200,
      width: "97vw",
      margin: "2.5rem auto 2rem auto"
    }}>
      <h2 style={{ color: "#009ee3", fontSize: "2.3rem", fontWeight: 700, textAlign: "left", marginBottom: 32 }}>Hesaplarım</h2>
      {accounts.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 40
        }}>
          {accounts.map(account => (
            <div key={account.id} style={{
              background: "#f7fbfd",
              borderRadius: 20,
              boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
              padding: "2rem 2.2rem 1.5rem 2.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minHeight: 210
            }}>
              <div style={{ fontWeight: 700, color: "#003366", fontSize: 18, marginBottom: 8 }}>IBAN: <span style={{ color: "#009ee3" }}>{account.iban}</span></div>
              <div style={{ fontWeight: 600, color: "#0061a8", fontSize: 16, marginBottom: 8 }}>Hesap No: {account.accountNumber}</div>
              <div style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>Tür: {account.accountType}</div>
              <div style={{ fontSize: 28, color: "#009ee3", fontWeight: 800, marginBottom: 12 }}>{account.balance.toLocaleString()} {account.currency}</div>
              <button
                onClick={() => navigate(`/transactions/${account.id}`)}
                style={{
                  background: "#009ee3",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.7rem 2.2rem",
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: "pointer",
                  marginTop: 8,
                  boxShadow: "0 2px 8px #b3e0f7"
                }}
              >
                İşlem Geçmişi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#888", fontSize: 20, textAlign: "center" }}>Hesap bulunamadı.</p>
      )}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        justifyContent: "center",
        marginTop: 16
      }}>
        <button onClick={() => navigate("/participation-loan")}
          style={actionBtnStyleGreen}>
          Katılım Kredisi Hesapla
        </button>
        <button onClick={() => navigate("/loan-apply")}
          style={actionBtnStyleBlue}>
          Kredi Başvurusu Yap
        </button>
        <button onClick={() => navigate("/my-loans")}
          style={actionBtnStyleBlue}>
          Kredi Başvuru Geçmişim
        </button>
        <button onClick={() => navigate("/create-account")}
          style={actionBtnStylePurple}>
          Yeni Hesap Oluştur
        </button>
        <button onClick={downloadPDF}
          style={actionBtnStyleBlue}>
          Hesapları PDF Olarak İndir
        </button>
        <button onClick={() => navigate('/update-customer-info')}
          style={actionBtnStyleOrange}>
          Bilgilerimi Güncelle
        </button>
      </div>
    </div>
  );
});

const actionBtnStyleGreen: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.2rem",
  fontWeight: 700,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const actionBtnStyleBlue: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.2rem",
  fontWeight: 700,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const actionBtnStylePurple: React.CSSProperties = {
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.2rem",
  fontWeight: 700,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const actionBtnStyleOrange: React.CSSProperties = {
  background: "#f59e42",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 2.2rem",
  fontWeight: 700,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};

export default Dashboard;
