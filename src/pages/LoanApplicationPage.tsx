import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Add profit rates for each type (same as ParticipationLoanCalculator)
const profitRates: Record<string, number> = { "İhtiyaç": 2.4, "Taşıt": 2.1, "Konut": 1.7 };
const loanTypeOrder = ["İhtiyaç", "Konut", "Taşıt"];

const LoanApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1000);
  // Only allow these terms
  const allowedTerms = [3, 6, 9, 12, 15, 18, 24, 48, 96, 120];
  const [term, setTerm] = useState(allowedTerms[0]);
  const [accounts, setAccounts] = useState<{ id: number; iban: string }[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loanTypes, setLoanTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState<number | null>(null);

  // Calculation state for each type
  const [calcResults, setCalcResults] = useState<Record<string, {
    totalProfit: number;
    totalRepayment: number;
    monthlyInstallment: number;
    loading: boolean;
  }>>({});

  // Calculate for all types when amount or term changes
  useEffect(() => {
    if (!amount || !term) {
      setCalcResults({});
      return;
    }
    let cancelled = false;
    const newResults: Record<string, any> = {};
    loanTypeOrder.forEach(typeName => {
      newResults[typeName] = { loading: true, totalProfit: 0, totalRepayment: 0, monthlyInstallment: 0 };
      axios.post("http://localhost:5252/api/participation/calculate", {
        amount,
        termInMonths: term,
        loanType: typeName,
      })
        .then(res => {
          if (!cancelled) setCalcResults(prev => ({ ...prev, [typeName]: { ...res.data, loading: false } }));
        })
        .catch(() => {
          if (!cancelled) setCalcResults(prev => ({ ...prev, [typeName]: { loading: false, totalProfit: 0, totalRepayment: 0, monthlyInstallment: 0 } }));
        });
    });
    setCalcResults(newResults);
    return () => { cancelled = true; };
  }, [amount, term]);

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

  // Helper: get type name by id
  const getTypeNameById = (id: number | null) => loanTypes.find(t => t.id === id)?.name;
  // Helper: get type id by name
  const getTypeIdByName = (name: string) => loanTypes.find(t => t.name === name)?.id;

  const handleRateClick = (name: string) => {
    const id = getTypeIdByName(name);
    if (id) setSelectedLoanTypeId(id);
  };

  // Get selected type name
  const selectedTypeName = getTypeNameById(selectedLoanTypeId);

  // Live calculation effect
  useEffect(() => {
    if (!selectedTypeName || !amount || !term) {
      // setCalcResult(null); // This state is no longer needed
      return;
    }
    let cancelled = false;
    // setCalcLoading(true); // This state is no longer needed
    axios.post("http://localhost:5252/api/participation/calculate", {
      amount,
      termInMonths: term,
      loanType: selectedTypeName,
    })
      .then(res => { if (!cancelled) { /* setCalcResult(res.data); */ } }) // setCalcResult is removed
      .catch(() => { if (!cancelled) { /* setCalcResult(null); */ } }) // setCalcResult is removed
      .finally(() => { if (!cancelled) { /* setCalcLoading(false); */ } }); // setCalcLoading is removed
    return () => { cancelled = true; };
  }, [selectedTypeName, amount, term]);

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
        maxWidth: 900,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2.2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Kredi Başvurusu</h2>
        {/* Calculation boxes for each type */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32, flexWrap: "wrap" }}>
          {loanTypeOrder.map(typeName => {
            const result = calcResults[typeName];
            return (
              <div key={typeName} style={{
                background: "#e6f4fa",
                borderRadius: 18,
                padding: "1.5rem 2.2rem 1.2rem 2.2rem",
                minWidth: 220,
                maxWidth: 260,
                flex: "1 1 220px",
                boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: "#009ee3", marginBottom: 8 }}>{typeName}</div>
                {(!result || result.loading) ? (
                  <div style={{ color: "#009ee3", fontWeight: 700, fontSize: 18, margin: "1.2rem 0" }}>Hesaplanıyor...</div>
                ) : (
                  <>
                    <div style={{ textAlign: "center", marginBottom: 8 }}>
                      <span style={{ color: "#003366", fontSize: 15, display: "block" }}>Uygulanan Kar Payı</span>
                      <span style={{ color: "#009ee3", fontSize: 22, fontWeight: 800 }}>%{profitRates[typeName].toFixed(2)}</span>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: 8 }}>
                      <span style={{ color: "#003366", fontSize: 15, display: "block" }}>Aylık Taksit</span>
                      <span style={{ color: "#009ee3", fontSize: 22, fontWeight: 800 }}>{result.monthlyInstallment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ color: "#003366", fontSize: 15, display: "block" }}>Toplam Geri Ödeme</span>
                      <span style={{ color: "#009ee3", fontSize: 22, fontWeight: 800 }}>{result.totalRepayment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* Form below */}
        {successMessage && (
          <div style={{
            background: "#e6f4fa",
            color: "#009e3e",
            borderRadius: 12,
            padding: "1.2rem 1.5rem",
            marginBottom: 24,
            fontWeight: 600,
            fontSize: 18,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,97,168,0.08)"
          }}>
            {successMessage} ({countdown})
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label style={labelStyle}>Kredi Türü</label>
            <select
              value={selectedLoanTypeId ?? ""}
              onChange={(e) => setSelectedLoanTypeId(parseInt(e.target.value))}
              required
              style={inputStyle}
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
            <label style={labelStyle}>Tutar</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              style={inputStyle}
              min={1000}
              max={4500000}
            />
          </div>
          <div>
            <label style={labelStyle}>Vade (Ay)</label>
            <select
              value={term}
              onChange={e => setTerm(parseInt(e.target.value))}
              required
              style={inputStyle}
            >
              {allowedTerms.map(opt => (
                <option key={opt} value={opt}>{opt} Ay</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Hesap Seç (IBAN)</label>
            <select
              value={selectedAccountId ?? ""}
              onChange={(e) => setSelectedAccountId(parseInt(e.target.value))}
              required
              style={inputStyle}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.iban}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={countdown > 0}
            style={{
              background: "#009ee3",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "1rem 0",
              fontSize: 20,
              fontWeight: 700,
              marginTop: 8,
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
              transition: "background 0.2s"
            }}
          >
            Başvur
          </button>
        </form>
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

export default LoanApplicationPage;
