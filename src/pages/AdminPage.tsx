import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  isApproved: boolean;
}

interface LoanApplication {
  id: number;
  user: {
    fullName: string;
  };
  loanType: string;
  amount: number;
  termInMonths: number;
  applicationDate: string;
  status: string;
}

const AdminPage = () => {
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showLoans, setShowLoans] = useState(false);

  const token = localStorage.getItem("token");

  // Kullanıcıları çek
  useEffect(() => {
    axios
      .get("http://localhost:5252/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Kullanıcılar alınamadı:", err));
  }, []);

  // Kredi başvurularını çek
  useEffect(() => {
    axios
      .get("http://localhost:5252/api/admin/loans/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLoanApplications(res.data))
      .catch((err) => console.error("Başvurular alınamadı:", err));
  }, []);

  const handleDeposit = async () => {
    try {
      await axios.post(
        "http://localhost:5252/api/account/admin/deposit",
        { iban, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Para başarıyla yüklendi.");
      setIban("");
      setAmount("");
    } catch (error: any) {
      setMessage(error.response?.data || "❌ Hata oluştu.");
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await axios.post(`http://localhost:5252/api/user/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u))
      );
      alert("✅ Kullanıcı onaylandı.");
    } catch {
      alert("❌ Onay işlemi başarısız.");
    }
  };

  const handleRejectUser = (userId: number) => {
    setUsers(users.filter((u) => u.id !== userId));
    alert("⛔ Kullanıcı reddedildi.");
  };

  const handleLoanDecision = async (loanId: number, status: string) => {
    try {
      await axios.put(
        `http://localhost:5252/api/admin/loans/${loanId}/update-status`,
        { newStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoanApplications(prev => prev.filter(loan => loan.id !== loanId));
      alert(`Başvuru ${status.toLowerCase()} edildi.`);
    } catch {
      alert("❌ Başvuru güncellenemedi.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>💸 Admin Para Yükleme</h2>
      <input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN" />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Tutar (TL)"
      />
      <button onClick={handleDeposit}>Yükle</button>
      {message && <p>{message}</p>}

      <hr style={{ margin: "30px 0" }} />

      <h2 onClick={() => setShowUsers(!showUsers)} style={{ cursor: "pointer" }}>
        👥 Onay Bekleyen Kullanıcılar {showUsers ? "▲" : "▼"}
      </h2>
      {showUsers && (
        <ul>
          {users.filter(u => !u.isApproved).map(user => (
            <li key={user.id} style={{ marginBottom: 10 }}>
              👤 {user.username} ({user.email})
              <button onClick={() => handleApproveUser(user.id)} style={{ marginLeft: 10 }}>
                Onayla
              </button>
              <button onClick={() => handleRejectUser(user.id)} style={{ marginLeft: 5, color: "red" }}>
                Reddet
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2 onClick={() => setShowLoans(!showLoans)} style={{ cursor: "pointer" }}>
        🧾 Onay Bekleyen Kredi Başvuruları {showLoans ? "▲" : "▼"}
      </h2>
      {showLoans && loanApplications.length > 0 ? (
        <ul>
          {loanApplications.map((loan) => (
            <li key={loan.id} style={{ marginBottom: 12 }}>
              <strong>Kullanıcı:</strong> {loan.user.fullName} |
              <strong> Tür:</strong> {loan.loanType} |
              <strong> Tutar:</strong> {loan.amount} TL |
              <strong> Vade:</strong> {loan.termInMonths} ay |
              <strong> Tarih:</strong> {new Date(loan.applicationDate).toLocaleString()}
              <br />
              <button onClick={() => handleLoanDecision(loan.id, "Approved")} style={{ marginRight: 5 }}>
                Onayla
              </button>
              <button onClick={() => handleLoanDecision(loan.id, "Rejected")} style={{ color: "red" }}>
                Reddet
              </button>
            </li>
          ))}
        </ul>
      ) : showLoans && <p>Bekleyen kredi başvurusu yok.</p>}
    </div>
  );
};

export default AdminPage;
