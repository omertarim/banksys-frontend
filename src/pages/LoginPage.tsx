// src/pages/LoginPage.tsx
import React from "react";
import HeroCarousel from "../components/HeroCarousel";

// import ParticipationLoanCalculator from "../components/ParticipationLoanCalculator"; // KALDIRILDI
import ExchangeRatesBox from "../components/ExchangeRatesBox";
import ProfitShareCalculator from "../components/ProfitShareCalculator";

const LoginPage = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f7fbfd"
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
        <HeroCarousel />
        {/* <div style={{ marginTop: 32 }}>
          <ParticipationLoanCalculator />
        </div> */}
        <ProfitShareCalculator />
        <ExchangeRatesBox />
      </div>
      <footer className="text-sm text-center text-gray-500 mb-4">
        <p className="mb-1">© 2025 BankSys</p>
        <a href="/help" className="underline">Yardım / Güvenlik</a>
      </footer>
    </div>
  );
};

export default LoginPage;
