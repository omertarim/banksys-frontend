import React, { useState } from "react";
import axios from "axios";

const TransferForm = () => {
  const [receiverIban, setReceiverIban] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5252/api/account/transfer",
        {
          receiverIban,
          amount: parseFloat(amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Transfer başarılı!");
      setReceiverIban("");
      setAmount("");
    } catch (error: any) {
      alert("Transfer başarısız: " + (error.response?.data || "Bilinmeyen hata"));
    }
  };

  return (
    <form onSubmit={handleTransfer} className="max-w-md mx-auto space-y-4 p-4 border rounded mt-6">
      <h3 className="text-xl font-bold mb-2">Para Transferi</h3>
      <input
        type="text"
        placeholder="Alıcı IBAN"
        value={receiverIban}
        onChange={(e) => setReceiverIban(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <input
        type="number"
        placeholder="Miktar (₺)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-4 py-2"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700"
      >
        Gönder
      </button>
    </form>
  );
};

export default TransferForm;
