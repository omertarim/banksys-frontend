
import React, { useEffect, useState } from "react";
import axios from "axios";

const currencies = ["USD", "EUR", "GBP", "CHF", "JPY", "TRY"];

const ExchangeRatesBox = () => {
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
  const [date, setDate] = useState<string>("");
  const [base, setBase] = useState<string>("EUR");

  useEffect(() => {
    axios
      .get("http://data.fixer.io/api/latest?access_key=00fd31cf523bab8724866a587870869e&symbols=" + currencies.join(","))
      .then(res => {
        setRates(res.data && res.data.rates ? res.data.rates : {});
        setDate(res.data.date || "");
        setBase(res.data.base || "EUR");
      })
      .catch(() => setRates({}));
  }, []);

  // Show all rates as '1 [currency] = X [base]' (e.g., 1 USD = X EUR)
  let displayRates: { cur: string; value: string }[] = [];
  if (rates && base) {
    for (let cur of currencies) {
      if (cur !== base && rates[cur] && rates[base]) {
        // 1 cur = ? base
        const value = (rates[base] / rates[cur]).toFixed(4);
        displayRates.push({ cur, value });
      }
    }
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 32,
      boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
      padding: "3rem 4.5rem 2.5rem 4.5rem",
      maxWidth: 1100,
      width: "95vw",
      minHeight: 180,
      margin: "2.5rem auto 0 auto",
      textAlign: "center"
    }}>
      <h3 style={{ color: "#0061a8", fontWeight: 700, fontSize: 32, marginBottom: 28, letterSpacing: 1 }}>Güncel Döviz Kurları</h3>
      <div style={{ color: "#003366", fontWeight: 600, fontSize: 20, marginBottom: 18 }}>
        Kaynak Para Birimi: <span style={{ color: "#009ee3", fontWeight: 800 }}>{base}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
        {displayRates.map(({ cur, value }) => (
          <div key={cur} style={{ minWidth: 120 }}>
            <div style={{ fontWeight: 700, color: "#003366", fontSize: 28 }}>{cur}</div>
            <div style={{ fontSize: 28, color: "#009ee3", fontWeight: 800 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: "#888", fontSize: 18, marginTop: 18 }}>
        Son Güncelleme: {date}
      </div>
    </div>
  );
};

export default ExchangeRatesBox;