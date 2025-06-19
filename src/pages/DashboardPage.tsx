
import React from "react";
import Dashboard from "../components/Dashboard";
import TransferForm from "../components/TransferForm";


const DashboardPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Dashboard />
      <TransferForm />

    </div>
  );
};

export default DashboardPage;
