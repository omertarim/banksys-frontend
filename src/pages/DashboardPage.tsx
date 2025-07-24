import React, { useRef } from "react";
import Dashboard from "../components/Dashboard";
import TransferForm from "../components/TransferForm";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const dashboardRef = useRef<any>(null);

  // This function will be passed to TransferForm and called after a successful transfer
  const refreshAccounts = () => {
    if (dashboardRef.current && typeof dashboardRef.current.refreshAccounts === "function") {
      dashboardRef.current.refreshAccounts();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Dashboard ref={dashboardRef} />
      <TransferForm onTransferSuccess={refreshAccounts} />
      
    </div>
  );
};

export default DashboardPage;
