import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ParticipationLoanPage = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [loanType, setLoanType] = useState("İhtiyaç");
  const [result, setResult] = useState<null | {
    totalProfit: number;
    totalRepayment: number;
    monthlyInstallment: number;
  }>(null);

  const [paymentPlan, setPaymentPlan] = useState<
    { month: number; installment: number; totalPaid: number }[]
  >([]);

  const handleCalculate = async () => {
    try {
      const response = await axios.post("http://localhost:5252/api/participation/calculate", {
        amount: parseFloat(amount),
        termInMonths: parseInt(term),
        loanType,
      });

      setResult(response.data);

      const monthly = response.data.monthlyInstallment;
      const months = parseInt(term);
      const plan = [];

      for (let i = 1; i <= months; i++) {
        plan.push({
          month: i,
          installment: monthly,
          totalPaid: parseFloat((monthly * i).toFixed(2)),
        });
      }

      setPaymentPlan(plan);
    } catch (err: any) {
      alert(err.response?.data || "Hesaplama başarısız.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
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

          {/* Grafik */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Aylık Ödeme Grafiği</h3>
          <div className="h-72 bg-white border rounded p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentPlan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="installment" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tablo */}
          <h3 className="text-lg font-semibold mt-6 mb-2">Ödeme Planı</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Taksit</th>
                <th className="border px-2 py-1">Aylık Ödeme (₺)</th>
                <th className="border px-2 py-1">Toplam Ödenen (₺)</th>
              </tr>
            </thead>
            <tbody>
              {paymentPlan.map((row) => (
                <tr key={row.month}>
                  <td className="border px-2 py-1">{row.month}</td>
                  <td className="border px-2 py-1">{row.installment.toFixed(2)}</td>
                  <td className="border px-2 py-1">{row.totalPaid.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParticipationLoanPage;
