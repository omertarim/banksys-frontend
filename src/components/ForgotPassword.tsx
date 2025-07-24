// components/ForgotPassword.tsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/forgot-password", { email });
      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch {
      setMessage("Bir hata oluştu. E-posta adresi geçerli mi?");
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
      <form onSubmit={handleSubmit} style={{
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
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 18, textAlign: "center", letterSpacing: 1 }}>Şifremi Unuttum</h2>
        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyleBlue}
        >
          Gönder
        </button>
        {message && <div style={{ color: message.includes("gönderildi") ? "#16a34a" : "#ef4444", fontWeight: 600, textAlign: "center", marginTop: 12 }}>{message}</div>}
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

export default ForgotPassword;
