import React, { useEffect, useState } from "react";
import axios from "axios";

type BalanceInfo = {
  iban: string;
  balance: number;
};

const Dashboard = () => {
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5252/api/account/15/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalanceInfo(response.data);
      } catch (error) {
        alert("Bakiye alınamadı.");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Hesap Özeti</h2>
      {balanceInfo ? (
        <div className="space-y-2">
          <p><strong>IBAN:</strong> {balanceInfo.iban}</p>
          <p><strong>Bakiye:</strong> {balanceInfo.balance} ₺</p>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
};

export default Dashboard;
