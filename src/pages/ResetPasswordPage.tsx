// components/ResetPassword.tsx
import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5252/api/user/reset-password", {
        token,
        newPassword,
      });
      setMessage("Şifreniz başarıyla güncellendi.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("Şifre sıfırlanamadı.");
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
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
          padding: "3.5rem 4.5rem 3rem 4.5rem",
          maxWidth: 420,
          width: "95vw",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          animation: "fadeInResetBox 0.7s cubic-bezier(.39,.575,.56,1)"
        }}
      >
        <h2 style={{ color: "#009ee3", fontSize: "2rem", fontWeight: 700, marginBottom: 32, textAlign: "center", letterSpacing: 1 }}>Yeni Şifre Belirle</h2>
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            ...buttonStyleBlue,
            background: isButtonHovered ? "#0077b6" : buttonStyleBlue.background
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Şifreyi Güncelle
        </button>
        {message && <div style={{ color: message.includes("başarı") ? "#16a34a" : "#ef4444", fontWeight: 600, textAlign: "center", marginTop: 12 }}>{message}</div>}
      </form>
      <style>{`
        @keyframes fadeInResetBox {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        input::placeholder {
          color: #b6d6ea !important;
          opacity: 1;
        }
      `}</style>
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
  marginBottom: 0,
  transition: "border 0.2s"
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

export default ResetPasswordPage;
