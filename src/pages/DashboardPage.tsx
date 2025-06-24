import React from "react";
import Dashboard from "../components/Dashboard";
import TransferForm from "../components/TransferForm";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Dashboard />
      <TransferForm />

      <div className="mt-6">
        <Link
          to="/my-loans"
          className="text-blue-600 hover:underline block mb-2"
        >
          Kredi Başvuru Geçmişim
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
