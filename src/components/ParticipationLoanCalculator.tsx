import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const loanTypes = [
  {
    value: "İhtiyaç",
    label: "İhtiyaç",
    icon: <img src="/streamline-kameleon-color--sofa-3.png" alt="İhtiyaç" width={38} height={38} />
  },
  {
    value: "Konut",
    label: "Konut",
    icon: <img src="/streamline-kameleon-color--house-location.png" alt="Konut" width={38} height={38} />
  },
  {
    value: "Taşıt",
    label: "Taşıt",
    icon: <img src="/streamline-kameleon-color--car-list (1).png" alt="Taşıt" width={38} height={38} />
  }
];
const terms = [3, 6, 9, 12, 15, 18, 24, 48, 96, 120];
const profitRates: Record<string, number> = { "İhtiyaç": 2.4, "Taşıt": 2.1, "Konut": 1.7 };

const minAmount = 1000;
const maxAmount = 4500000;

const ParticipationLoanCalculator = () => {
  const [amount, setAmount] = useState(50000);
  const [amountInput, setAmountInput] = useState("50,000");
  const [term, setTerm] = useState(36);
  const [loanType, setLoanType] = useState("İhtiyaç");
  const [result, setResult] = useState<null | {
    totalProfit: number;
    totalRepayment: number;
    monthlyInstallment: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const resultBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAmountInput(amount.toLocaleString());
  }, [amount]);

  useEffect(() => {
    let cancelled = false;
    const calculate = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5252/api/participation/calculate", {
          amount,
          termInMonths: term,
          loanType,
        });
        if (!cancelled) setResult(response.data);
      } catch (err: any) {
        if (!cancelled) setResult(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    calculate();
    return () => { cancelled = true; };
  }, [amount, term, loanType]);

  const netOranAylik = profitRates[loanType];
  const brutOranYillik = (netOranAylik * 12).toFixed(2);

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInput(e.target.value);
  };
  const commitAmountInput = () => {
    let val = parseInt(amountInput.replace(/\D/g, ""), 10);
    if (isNaN(val)) val = minAmount;
    if (val < minAmount) val = minAmount;
    if (val > maxAmount) val = maxAmount;
    setAmount(val);
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 32,
      boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
      padding: "3.5rem 4.5rem 3rem 4.5rem",
      maxWidth: 1100,
      width: "95vw",
      minHeight: 480,
      display: "flex",
      flexDirection: "column",
      gap: "2.5rem",
      margin: "0 auto"
    }}>
      <h2 style={{ color: "#009ee3", fontSize: "2.5rem", fontWeight: 700, marginBottom: 28, textAlign: "center", letterSpacing: 1 }}>Kredi Hesaplama</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 64, marginBottom: 28 }}>
        {loanTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setLoanType(type.value)}
            style={{
              background: loanType === type.value ? "#e6f4fa" : "#f7fbfd",
              border: loanType === type.value ? "3px solid #009ee3" : "2px solid #e6f4fa",
              borderRadius: 24,
              padding: "1.5rem 2.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: loanType === type.value ? "0 4px 18px #b3e0f7" : "none",
              transition: "all 0.2s"
            }}
          >
            {type.icon}
            <span style={{ marginTop: 12, color: loanType === type.value ? "#009ee3" : "#003366", fontWeight: 700, fontSize: 22 }}>{type.label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 20 }}>
        <label style={{ fontWeight: 600, color: "#003366" }}>Tutar</label>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <input type="range" min={minAmount} max={maxAmount} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ flex: 1 }} />
          <input
            type="text"
            value={amountInput}
            onChange={handleAmountInput}
            onBlur={commitAmountInput}
            onKeyDown={e => { if (e.key === "Enter") commitAmountInput(); }}
            style={{
              width: 160,
              padding: "0.7rem 1.2rem",
              border: "2px solid #009ee3",
              borderRadius: 12,
              fontWeight: 700,
              color: "#009ee3",
              fontSize: 22,
              background: "#f7fbfd",
              outline: "none",
              textAlign: "right"
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={9}
          />
          <span style={{ color: "#009ee3", fontWeight: 700, fontSize: 22, marginLeft: 4 }}>TL</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 20 }}>
        <label style={{ fontWeight: 600, color: "#003366" }}>Vade</label>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {terms.map(v => (
            <button
              key={v}
              style={{
                background: term === v ? "#009ee3" : "#e6f4fa",
                color: term === v ? "#fff" : "#0061a8",
                border: "2px solid #009ee3",
                borderRadius: 10,
                padding: "0.7rem 2.2rem",
                fontWeight: 700,
                fontSize: 20,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={() => setTerm(v)}
            >
              {v} Ay
            </button>
          ))}
        </div>
      </div>
      <div ref={resultBoxRef} style={{ minHeight: 120, marginTop: 18 }}>
        {(loading || result) && (
          <div style={{
            background: "#e6f4fa",
            borderRadius: 18,
            padding: "2rem 2.5rem 1.5rem 2.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 32,
            fontSize: 22,
            fontWeight: 700,
            alignItems: "center"
          }}>
            {loading && (
              <div style={{ color: "#009ee3", fontWeight: 700, width: "100%", textAlign: "center", fontSize: 24 }}>
                Hesaplanıyor...
              </div>
            )}
            {!loading && result && <>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Uygulanan Kar Payı</span>
                <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>%{profitRates[loanType].toFixed(2)}</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Aylık Taksit</span>
                <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>{result.monthlyInstallment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Toplam Geri Ödeme</span>
                <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>{result.totalRepayment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} TL</span>
              </div>
            </>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationLoanCalculator; 