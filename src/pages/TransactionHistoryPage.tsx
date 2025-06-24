import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Transaction {
  id: number;
  amount: number;
  timestamp: string;
  senderFullName: string;
}

const TransactionHistoryPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5252/api/transactions/by-account/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("İşlem geçmişi alınamadı:", err);
      }
    };

    if (accountId) {
      fetchTransactions();
    }
  }, [accountId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">İşlem Geçmişi (Gelen Paralar)</h2>
      {transactions.length === 0 ? (
        <p>Henüz bu hesaba gelen para bulunmamaktadır.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li key={tx.id} className="bg-white p-4 rounded shadow">
              <p><strong>Gönderen:</strong> {tx.senderFullName}</p>
              <p><strong>Miktar:</strong> {tx.amount} ₺</p>
              <p><strong>Tarih:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistoryPage;
