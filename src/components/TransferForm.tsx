import React, { useState, useEffect } from "react";
import axios from "axios";

type Account = {
  id: number;
  accountNumber: string;
  iban: string;
};

type TransferFormProps = {
  onTransferSuccess?: () => void;
};

const TransferForm: React.FC<TransferFormProps> = ({ onTransferSuccess }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [receiverIban, setReceiverIban] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5252/api/account/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccounts(response.data);
        if (response.data.length > 0) {
          setSelectedAccountId(response.data[0].id); // Varsayılan ilk hesap
        }
      } catch (error) {
        alert("Hesaplar alınamadı.");
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5252/api/account/transfer",
        {
          senderAccountId: parseInt(selectedAccountId),
          receiverIban,
          amount: parseFloat(amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Transfer başarılı!");
      setReceiverIban("");
      setAmount("");
      if (onTransferSuccess) onTransferSuccess();
    } catch (error: any) {
      alert("Transfer başarısız: " + (error.response?.data || "Bilinmeyen hata"));
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      boxShadow: "0 4px 24px rgba(0,97,168,0.10)",
      padding: "2.5rem 3.5rem 2rem 3.5rem",
      maxWidth: 600,
      width: "95vw",
      margin: "2.5rem auto 0 auto"
    }}>
      <h3 style={{ color: "#009ee3", fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: "center" }}>Para Transferi</h3>
      <form onSubmit={handleTransfer}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 24 }}>
          <label style={{ fontWeight: 600, color: "#003366", fontSize: 18 }}>Gönderen Hesap</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            style={inputStyle}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} - {account.iban}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Alıcı IBAN"
            value={receiverIban}
            onChange={(e) => setReceiverIban(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Miktar (₺)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#22c55e",
            color: "#fff",
            padding: "1.1rem 0",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 2px 8px #b3e0f7",
            transition: "background 0.2s"
          }}
        >
          Gönder
        </button>
      </form>
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

export default TransferForm;
