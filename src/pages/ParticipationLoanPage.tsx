import React, { useState } from "react";
import axios from "axios";

const ParticipationLoanPage = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [loanType, setLoanType] = useState("İhtiyaç"); // default
  const [result, setResult] = useState<null | {
    totalProfit: number;
    totalRepayment: number;
    monthlyInstallment: number;
  }>(null);

  const handleCalculate = async () => {
    try {
      const response = await axios.post("http://localhost:5252/api/participation/calculate", {
        amount: parseFloat(amount),
        termInMonths: parseInt(term),
        loanType,
      });

      setResult(response.data);
    } catch (err: any) {
      alert(err.response?.data || "Hesaplama başarısız.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Katılım Bankası Kredi Hesaplama</h2>

      <input
        type="number"
        placeholder="Kredi Tutarı (TL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border px-3 py-2 w-full mb-2"
      />

      <input
        type="number"
        placeholder="Vade (Ay)"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border px-3 py-2 w-full mb-2"
      />

      <select
        value={loanType}
        onChange={(e) => setLoanType(e.target.value)}
        className="border px-3 py-2 w-full mb-4"
      >
        <option value="İhtiyaç">İhtiyaç Kredisi</option>
        <option value="Taşıt">Taşıt Kredisi</option>
        <option value="Konut">Konut Kredisi</option>
      </select>

      <button
        onClick={handleCalculate}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Hesapla
      </button>

      {result && (
        <div className="mt-6 text-left">
          <p><strong>Aylık Taksit:</strong> {result.monthlyInstallment} TL</p>
          <p><strong>Toplam Geri Ödeme:</strong> {result.totalRepayment} TL</p>
        </div>
      )}
    </div>
  );
};

export default ParticipationLoanPage;
