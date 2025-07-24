import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserApprovalPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5252/api/user/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Bekleyen kullanıcılar alınamadı:", err);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5252/api/user/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Onaylama hatası:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5252/api/user/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Reddetme hatası:", err);
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
        maxWidth: 600,
        width: "95vw",
        margin: "0 auto"
      }}>
        <h1 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Bekleyen Kullanıcılar</h1>
        {users.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18, textAlign: "center", margin: "2rem 0" }}>Bekleyen kullanıcı yok.</div>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {users.map((user) => (
              <li key={user.id} style={{
                background: "#f7fbfd",
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,97,168,0.06)",
                padding: "1.2rem 1.5rem",
                fontSize: 17,
                color: "#003366",
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
                <div><strong>Ad:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => handleApprove(user.id)} style={buttonStyleGreen}>Onayla</button>
                  <button onClick={() => handleReject(user.id)} style={buttonStyleRed}>Reddet</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
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

export default AdminUserApprovalPage;
