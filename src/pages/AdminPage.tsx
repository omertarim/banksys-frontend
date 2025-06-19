import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  isApproved: boolean;
}

const AdminPage = () => {
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  // Kullanıcı listesini çek
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5252/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Para yükleme işlemi
  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5252/api/account/admin/deposit",
        { iban, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Para başarıyla yüklendi.");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Hata oluştu. Lütfen bilgileri kontrol edin."
      );
    }
  };

  // Kullanıcıyı onayla
  const handleApprove = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5252/api/user/approve/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u))
      );
      alert("Kullanıcı onaylandı.");
    } catch (error) {
      alert("Onaylama işlemi başarısız.");
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

      <hr />
      <h2>Onay Bekleyen Kullanıcılar</h2>
      <ul>
        {users.filter((u) => !u.isApproved).map((u) => (
          <li key={u.id}>
            {u.username} - {u.email}{" "}
            <button onClick={() => handleApprove(u.id)}>Onayla</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
