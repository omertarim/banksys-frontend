import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  score?: {
    averageMonthlyBalance: number;
    monthlyIncome: number;
    debtToIncomeRatio: number;
    previousLoanApplications: number;
    finalScore: number;
    riskLevelId?: number;
    riskLevelName?: string;
    recommendedApprovalId?: number;
    recommendedApprovalName?: string;
    recommendationStatusId?: number;
    recommendationStatusName?: string;
  };
}

const AdminPage = () => {
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [showLoans, setShowLoans] = useState(false);
  const [loadingScores, setLoadingScores] = useState<Record<number, boolean>>({});

  const token = localStorage.getItem("token");

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

  const calculateScore = async (loanId: number) => {
    setLoadingScores(prev => ({ ...prev, [loanId]: true }));
    try {
      const response = await axios.post(
        `http://localhost:5252/api/admin/loans/${loanId}/recalculate-score`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the loan application with new score data
      setLoanApplications(prev => prev.map(loan => 
        loan.id === loanId 
          ? { ...loan, score: response.data.score }
          : loan
      ));
      
      alert("✅ Kredi skoru başarıyla hesaplandı!");
    } catch (error: any) {
      alert(`❌ Skor hesaplanamadı: ${error.response?.data?.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoadingScores(prev => ({ ...prev, [loanId]: false }));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const getRiskLevelColor = (riskLevel: string | undefined) => {
    if (!riskLevel) return "#6b7280";
    switch (riskLevel.toLowerCase()) {
      case "low": return "#22c55e";
      case "medium": return "#f59e0b";
      case "high": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7fbfd",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 48
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
        padding: "3.5rem 4.5rem 3rem 4.5rem",
        maxWidth: 900,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Admin Paneli</h2>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: "#003366", fontWeight: 600, fontSize: 20, marginBottom: 12 }}>💸 Para Yükleme</h3>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN" style={inputStyle} />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Tutar (TL)"
              style={inputStyle}
            />
            <button onClick={handleDeposit} style={buttonStyleBlue}>Yükle</button>
          </div>
          {message && <div style={{ color: message.startsWith("✅") ? "#16a34a" : "#ef4444", fontWeight: 600, marginTop: 6 }}>{message}</div>}
        </div>
        <div style={{ marginBottom: 32 }}>
          <Link to="/admin/user-approval">
            <button style={buttonStylePurple}>
              👥 Kullanıcıları Yönet
            </button>
          </Link>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 onClick={() => setShowLoans(!showLoans)} style={{ cursor: "pointer", color: "#003366", fontWeight: 600, fontSize: 20, marginBottom: 12 }}>
            🧾 Onay Bekleyen Kredi Başvuruları {showLoans ? "▲" : "▼"}
          </h3>
          {showLoans && loanApplications.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loanApplications.map((loan) => (
                <li key={loan.id} style={{
                  background: "#f7fbfd",
                  borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(0,97,168,0.06)",
                  padding: "1.2rem 1.5rem",
                  fontSize: 17,
                  color: "#003366",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div><strong>Kullanıcı:</strong> {loan.user.fullName}</div>
                    <div><strong>Tür:</strong> {loan.loanType}</div>
                    <div><strong>Tutar:</strong> {loan.amount.toLocaleString()} TL</div>
                    <div><strong>Vade:</strong> {loan.termInMonths} ay</div>
                    <div><strong>Tarih:</strong> {new Date(loan.applicationDate).toLocaleString()}</div>
                  </div>
                  
                  {/* Score Section */}
                  {loan.score ? (
                    <div style={{
                      background: "#e6f4fa",
                      borderRadius: 10,
                      padding: "1rem",
                      marginTop: 8,
                      border: "1px solid #b3e0f7"
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 8, color: "#009ee3" }}>📊 Kredi Skoru Analizi</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                                                 <div>
                           <span style={{ fontSize: 14, color: "#666" }}>Final Skor:</span>
                           <div style={{ 
                             fontSize: 18, 
                             fontWeight: 700, 
                             color: getScoreColor(loan.score.finalScore || 0) 
                           }}>
                             {loan.score.finalScore || 0}/100
                           </div>
                         </div>
                                                 <div>
                           <span style={{ fontSize: 14, color: "#666" }}>Risk Seviyesi:</span>
                           <div style={{ 
                             fontSize: 16, 
                             fontWeight: 600, 
                             color: getRiskLevelColor(loan.score.riskLevelName) 
                           }}>
                             {loan.score.riskLevelName || "Belirsiz"}
                           </div>
                         </div>
                                                 <div>
                           <span style={{ fontSize: 14, color: "#666" }}>Önerilen Karar:</span>
                           <div style={{ 
                             fontSize: 16, 
                             fontWeight: 600, 
                             color: loan.score.recommendedApprovalName === "Approved" ? "#22c55e" : "#ef4444" 
                           }}>
                             {loan.score.recommendedApprovalName === "Approved" ? "✅ Onay" : "❌ Red"}
                           </div>
                         </div>
                         <div>
                           <span style={{ fontSize: 14, color: "#666" }}>Açıklama:</span>
                           <div style={{ fontSize: 14, color: "#666" }}>
                             {loan.score.recommendationStatusName || "Açıklama yok"}
                           </div>
                         </div>
                      </div>
                                             <div style={{ 
                         display: "grid", 
                         gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                         gap: 8, 
                         marginTop: 8,
                         fontSize: 12,
                         color: "#666"
                       }}>
                         <div>Aylık Ortalama Bakiye: {(loan.score.averageMonthlyBalance || 0).toLocaleString()} TL</div>
                         <div>Aylık Gelir: {(loan.score.monthlyIncome || 0).toLocaleString()} TL</div>
                         <div>Borç/Gelir Oranı: %{((loan.score.debtToIncomeRatio || 0) * 100).toFixed(2)}</div>
                         <div>Önceki Başvuru Sayısı: {loan.score.previousLoanApplications || 0}</div>
                       </div>
                    </div>
                  ) : (
                    <div style={{ 
                      background: "#fff3cd", 
                      borderRadius: 10, 
                      padding: "0.8rem", 
                      marginTop: 8,
                      border: "1px solid #ffeaa7",
                      fontSize: 14,
                      color: "#856404"
                    }}>
                      ⚠️ Bu başvuru için henüz skor hesaplanmamış.
                    </div>
                  )}
                  
                  <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                    {!loan.score && (
                      <button 
                        onClick={() => calculateScore(loan.id)} 
                        disabled={loadingScores[loan.id]}
                        style={{
                          ...buttonStyleBlue,
                          opacity: loadingScores[loan.id] ? 0.6 : 1,
                          fontSize: 14,
                          padding: "0.6rem 1rem"
                        }}
                      >
                        {loadingScores[loan.id] ? "🔄 Hesaplanıyor..." : "📊 Skor Hesapla"}
                      </button>
                    )}
                    <button onClick={() => handleLoanDecision(loan.id, "Approved")} style={buttonStyleGreen}>Onayla</button>
                    <button onClick={() => handleLoanDecision(loan.id, "Rejected")} style={buttonStyleRed}>Reddet</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : showLoans && <div style={{ color: "#888", fontSize: 16, marginTop: 12 }}>Bekleyen kredi başvurusu yok.</div>}
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0
};

const buttonStyleBlue: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 1.5rem",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const buttonStylePurple: React.CSSProperties = {
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 1.5rem",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const buttonStyleGreen: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0.7rem 1.2rem",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};
const buttonStyleRed: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0.7rem 1.2rem",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #b3e0f7",
  transition: "background 0.2s"
};

export default AdminPage;
