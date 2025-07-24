import { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [accountType, setAccountType] = useState("Cari");
  const [currency, setCurrency] = useState("TL");
  const [result, setResult] = useState<{ iban: string; accountNumber: string } | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5252/api/account/create",
        { accountType, currency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({
        iban: response.data.iban,
        accountNumber: response.data.accountNumber,
      });
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Hesap oluşturulamadı.");
    }
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
        maxWidth: 420,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h1 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Yeni Hesap Oluştur</h1>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Hesap Türü</label>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)} style={inputStyle}>
            <option value="Cari">Cari</option>
            <option value="Katılma">Katılma</option>
            <option value="POS">POS</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Para Birimi</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
            <option value="TL">TL</option>
            {/* Gelecekte diğer para birimleri buraya eklenebilir */}
          </select>
        </div>
        <button onClick={handleCreate} style={buttonStyle}>
          Hesap Oluştur
        </button>
        {result && (
          <div style={{
            marginTop: 28,
            padding: "1.2rem 1.5rem",
            borderRadius: 12,
            background: "#e6f4fa",
            color: "#009e3e",
            fontWeight: 600,
            fontSize: 18,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,97,168,0.08)"
          }}>
            <div><strong>IBAN:</strong> {result.iban}</div>
            <div><strong>Hesap No:</strong> {result.accountNumber}</div>
          </div>
        )}
        {error && <div style={{ color: "#ef4444", marginTop: 18, fontWeight: 600, textAlign: "center" }}>{error}</div>}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 18,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#003366",
  fontSize: 18,
  marginBottom: 6,
  display: "block"
};

const buttonStyle: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 0",
  fontSize: 20,
  fontWeight: 700,
  marginTop: 8,
  width: "100%",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
  transition: "background 0.2s"
};

export default CreateAccount;
