import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginCustomer = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [citizenshipCountryId, setCitizenshipCountryId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody: any = {
      password,
    };

    if (customerNumber.trim() !== "") {
      requestBody.customerNumber = customerNumber;
    } else if (citizenshipCountryId.trim() !== "") {
      requestBody.citizenshipCountryId = Number(citizenshipCountryId);
    } else {
      alert("Lütfen müşteri numarası veya vatandaşlık ülke ID'si giriniz.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5252/api/customer/login", requestBody);
      const token = response.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Customer") {
        navigate("/dashboard");
      } else {
        alert("Bu sayfaya sadece müşteri kullanıcılar giriş yapabilir.");
      }
    } catch (error: any) {
      alert("Giriş başarısız: " + (error.response?.data || "Hata"));
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 32,
      boxShadow: "0 8px 32px rgba(0,97,168,0.13)",
      padding: "3rem 4.5rem 2.5rem 4.5rem",
      maxWidth: 500,
      width: "95vw",
      margin: "3rem auto 2rem auto"
    }}>
      <h2 style={{ color: "#009ee3", fontSize: "2.3rem", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Müşteri Girişi</h2>
      <p style={{ textAlign: "center", color: "#003366", fontSize: 18, marginBottom: 32 }}>
        BankSys müşteri hesabınıza giriş yapmak için lütfen bilgilerinizi giriniz.
      </p>
      <form onSubmit={handleLogin}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Müşteri Numarası (isteğe bağlı)"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Citizenship Country ID (isteğe bağlı)"
            value={citizenshipCountryId}
            onChange={(e) => setCitizenshipCountryId(e.target.value)}
            style={inputStyle}
          />
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
          style={{
            width: "100%",
            background: "#009ee3",
            color: "#fff",
            padding: "1.1rem 0",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 2px 8px #b3e0f7",
            transition: "background 0.2s"
          }}
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

export default LoginCustomer;
