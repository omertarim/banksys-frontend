import React, { useState } from "react";

const minAmount = 1000;
const maxAmount = 1000000;
const terms = [1, 3, 6, 12];
const products = [
  { value: "katilma", label: "Katılma Hesabı", hesap: "Klasik" }
];
const currencies = [
  { value: "TL", label: "TL" },
];
const BRUT_ORAN_YILLIK = 32.66;
const STOPAJ_ORANI = 0.15; // 15% withholding tax

const ProfitShareCalculator = () => {
  const [product, setProduct] = useState(products[0].value);
  const [currency, setCurrency] = useState(currencies[0].value);
  const [amount, setAmount] = useState(50000);
  const [amountInput, setAmountInput] = useState("50,000");
  const [term, setTerm] = useState(12); // in months

  // Sync input and slider
  React.useEffect(() => {
    setAmountInput(amount.toLocaleString());
  }, [amount]);

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

  // Calculation
  const brutKar = Math.max(0, ((amount * BRUT_ORAN_YILLIK / 100) * (term / 12)));
  const kesilenVergi = Math.max(0, brutKar * STOPAJ_ORANI);
  const netKar = Math.max(0, brutKar - kesilenVergi);
  const netOranYillik = (BRUT_ORAN_YILLIK * (1 - STOPAJ_ORANI)).toFixed(2);

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
      <h2 style={{ color: "#009ee3", fontSize: "2.5rem", fontWeight: 700, marginBottom: 28, textAlign: "center", letterSpacing: 1 }}>Kâr Payı Hesaplama</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 18 }}>
        <select value={product} onChange={e => setProduct(e.target.value)} style={inputStyle}>
          {products.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
          {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
          <label style={{ fontWeight: 600, color: "#003366", fontSize: 18 }}>Tutar</label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <input type="range" min={minAmount} max={maxAmount} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ flex: 1 }} />
            <input
              type="text"
              value={amountInput}
              onChange={handleAmountInput}
              onBlur={commitAmountInput}
              onKeyDown={e => { if (e.key === "Enter") commitAmountInput(); }}
              style={{
                width: 120,
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
            <span style={{ color: "#009ee3", fontWeight: 700, fontSize: 22, marginLeft: 4 }}>{currency}</span>
          </div>
        </div>
        <select value={term} onChange={e => setTerm(Number(e.target.value))} style={inputStyle}>
          {terms.map(t => <option key={t} value={t}>{t} Ay</option>)}
        </select>
      </div>
      <div style={{
        background: "#e6f4fa",
        borderRadius: 18,
        padding: "2rem 2.5rem 1.5rem 2.5rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 32,
        fontSize: 22,
        fontWeight: 700,
        alignItems: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Net Kâr</span>
          <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>{netKar.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} {currency}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Brüt Kâr</span>
          <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>{brutKar.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} {currency}</span>
        </div>
        
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Net Oran (Yıllık)</span>
          <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>%{netOranYillik}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Brüt Oran (Yıllık)</span>
          <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>%{BRUT_ORAN_YILLIK}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#003366", fontSize: 18, display: "block" }}>Hesap</span>
          <span style={{ color: "#009ee3", fontSize: 28, fontWeight: 800 }}>{products.find(p => p.value === product)?.hesap}</span>
        </div>
      </div>
      <div style={{ color: "#888", fontSize: 15, marginTop: 18, textAlign: "center" }}>
        * Net kâr, brüt kâr üzerinden %15 stopaj (vergi) düşülerek hesaplanmıştır. Hesaplamalar örnek oranlarla yapılmıştır. Güncel oranlar için şubemizle iletişime geçiniz.
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "1rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 18,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0,
  minWidth: 120
};

export default ProfitShareCalculator; 