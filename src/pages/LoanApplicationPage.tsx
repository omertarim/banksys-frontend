import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanApplicationPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [term, setTerm] = useState<number>(12);
  const [loanType, setLoanType] = useState<string>("İhtiyaç");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5252/api/participation/apply",
        {
          amount,
          termInMonths: term,
          creditType: loanType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Başvuru başarılı: " + response.data.message);
      navigate("/pending"); // başvuru sonrası yönlendirme
    } catch (err: any) {
      alert("Başvuru başarısız: " + (err.response?.data || "Hata"));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Katılım Kredisi Başvurusu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Kredi Tutarı (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border px-4 py-2"
            required
          />
        </div>
        <div>
          <label>Vade (Ay)</label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full border px-4 py-2"
            required
          />
        </div>
        <div>
          <label>Kredi Türü</label>
          <select
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="w-full border px-4 py-2"
          >
            <option value="İhtiyaç">İhtiyaç Kredisi</option>
            <option value="Taşıt">Taşıt Kredisi</option>
            <option value="Konut">Konut Kredisi</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Başvur
        </button>
      </form>
    </div>
  );
};

export default LoanApplicationPage;
