import React from "react";
import ParticipationLoanCalculator from "../components/ParticipationLoanCalculator";

const ParticipationLoanPage = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f7fbfd", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ParticipationLoanCalculator />
    </div>
  );
};

export default ParticipationLoanPage;
