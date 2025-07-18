import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState(0);
  const [accounts, setAccounts] = useState<{ id: number; iban: string }[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loanTypes, setLoanTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5252/api/account/my-accounts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccountId(res.data[0].id);
        }
      })
      .catch((err) => {
        console.error("Hesaplar alınamadı:", err);
      });

    // Kredi türlerini al
    axios.get("http://localhost:5252/api/LoanApplicationType/active", {
      headers: { Authorization: `Bearer ${token}` },
    })
    
      .then((res) => {
        setLoanTypes(res.data);
      })
      .catch((err) => {
        console.error("Kredi türleri alınamadı:", err);
      });
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && successMessage) {
      navigate("/dashboard");
    }
  }, [countdown, successMessage, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccountId || !selectedLoanTypeId) {
      alert("Lütfen kredi türü ve hesap seçin.");
      return;
    }

    axios
      .post(
        "http://localhost:5252/api/participation/apply",
        {
          LoanApplicationTypeId: selectedLoanTypeId,
          Amount: amount,
          TermInMonths: term,
          TargetAccountId: selectedAccountId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setSuccessMessage("Kredi başvurunuz onaya gönderilmiştir. Ana sayfaya yönlendiriliyorsunuz.");
        setCountdown(5);
      })
      .catch((err) => {
        console.error("Başvuru hatası:", err);
      });
  };

  return (
    <div>
      <h2>Kredi Başvurusu</h2>

      {successMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          {successMessage} ({countdown})
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Kredi Türü:</label>
          <select
            value={selectedLoanTypeId ?? ""}
            onChange={(e) => setSelectedLoanTypeId(parseInt(e.target.value))}
            required
          >
            <option value="">Seçiniz</option>
            {loanTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tutar:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Vade (Ay):</label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Hesap Seç (IBAN):</label>
          <select
            value={selectedAccountId ?? ""}
            onChange={(e) => setSelectedAccountId(parseInt(e.target.value))}
            required
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.iban}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={countdown > 0}>
          Başvur
        </button>
      </form>
    </div>
  );
};

export default LoanApplicationPage;
