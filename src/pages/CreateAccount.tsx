import { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [accountType, setAccountType] = useState("Cari");
  const [currency, setCurrency] = useState("TL");
  const [result, setResult] = useState<{ iban: string; accountNumber: string } | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5252/api/account/create",
        { accountType, currency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({
        iban: response.data.iban,
        accountNumber: response.data.accountNumber,
      });
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Hesap oluşturulamadı.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-xl font-bold">Yeni Hesap Oluştur</h1>

      <div>
        <label className="block mb-1">Hesap Türü</label>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="Cari">Cari</option>
          <option value="Katılma">Katılma</option>
          <option value="POS">POS</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Para Birimi</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="TL">TL</option>
          {/* Gelecekte diğer para birimleri buraya eklenebilir */}
        </select>
      </div>

      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Hesap Oluştur
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-green-100">
          <p><strong>IBAN:</strong> {result.iban}</p>
          <p><strong>Hesap No:</strong> {result.accountNumber}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateAccount;
