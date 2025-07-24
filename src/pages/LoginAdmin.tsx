import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5252/api/admin/login", {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (err: any) {
      alert("Giriş başarısız: " + (err.response?.data || "Hata"));
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
      <form onSubmit={handleLogin} style={{
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
        padding: "3.5rem 4.5rem 3rem 4.5rem",
        maxWidth: 420,
        width: "95vw",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 18, textAlign: "center", letterSpacing: 1 }}>Admin Girişi</h2>
        <div>
          <label style={labelStyle}>E-posta</label>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Şifre</label>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <button
          type="submit"
          style={buttonStyleBlue}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.2rem",
  border: "2px solid #009ee3",
  borderRadius: 10,
  fontSize: 18,
  fontWeight: 500,
  background: "#f7fbfd",
  color: "#003366",
  outline: "none",
  marginBottom: 0
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#003366",
  fontSize: 16,
  marginBottom: 6,
  display: "block"
};

const buttonStyleBlue: React.CSSProperties = {
  background: "#009ee3",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "1rem 0",
  fontSize: 20,
  fontWeight: 700,
  marginTop: 8,
  width: "100%",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,97,168,0.08)",
  transition: "background 0.2s"
};

export default LoginAdmin;
