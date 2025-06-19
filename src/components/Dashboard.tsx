import React, { useEffect, useState } from "react";
import axios from "axios";

type Account = {
  id: number;
  accountNumber: string;
  iban: string;
  balance: number;
  accountType: string;
  currency: string;
};

const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5252/api/account/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccounts(response.data);
      } catch (error) {
        alert("Hesaplar alınamadı.");
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Hesaplarım</h2>
      {accounts.length > 0 ? (
        <ul className="space-y-4">
          {accounts.map(account => (
            <li key={account.id} className="border p-4 rounded">
              <p><strong>IBAN:</strong> {account.iban}</p>
              <p><strong>Hesap No:</strong> {account.accountNumber}</p>
              <p><strong>Tür:</strong> {account.accountType}</p>
              <p><strong>Bakiye:</strong> {account.balance} {account.currency}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Hesap bulunamadı.</p>
      )}
    </div>
  );
};

export default Dashboard;
