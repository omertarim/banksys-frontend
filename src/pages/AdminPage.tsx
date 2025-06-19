import { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5252/api/account/admin/deposit",
        { iban, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Para başarıyla yüklendi.");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Hata oluştu. Lütfen bilgileri kontrol edin."
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Para Yükleme Sayfası</h2>
      <div>
        <label>IBAN:</label>
        <input
          type="text"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
        />
      </div>
      <div>
        <label>Yükleme Tutarı:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleDeposit}>Yükle</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPage;
